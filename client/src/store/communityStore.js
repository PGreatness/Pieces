import { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import AuthContext from '../auth/auth';

export const CommunityStoreContext = createContext({});

export const CommunityStoreActionType = {
    GET_ALL_THREADS: 'GET_ALL_THREADS',
    SET_TOP_THREADS: 'SET_TOP_THREADS',
    SET_SELECTED_INDEX: 'SET_SELECTED_INDEX',
}

const CommunityStoreContextProvider = (props) => {
    const navigate = useNavigate();

    const [communityStore, setCommunityStore] = useState({
        ALL_THREADS: [],
        TOP_THREADS: [],
        SELECTED_INDEX: -1,
    });

    const { auth } = useContext(AuthContext);

    const communityReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            case CommunityStoreActionType.GET_ALL_THREADS:
                return setCommunityStore({
                    ...communityStore,
                    ALL_THREADS: payload,
                });
            case CommunityStoreActionType.SET_TOP_THREADS:
                console.log('Setting top threads');
                console.log(payload);
                return setCommunityStore({
                    ...communityStore,
                    TOP_THREADS: payload,
                });
            case CommunityStoreActionType.SET_SELECTED_INDEX:
                return setCommunityStore({
                    ...communityStore,
                    SELECTED_INDEX: payload,
                });

            default:
                return communityStore;
        }
    }

    communityStore.createThread = async (title, content, user) => {
        console.log('Creating new thread');
        const thread = await api.createThread({
            threadName: title,
            threadText: content,
            senderId: user,
        });
        console.log(thread);
        if (thread.status < 400) {
            console.log('Thread created successfully');
            communityStore.getAllThreads();
            return thread.data;
        } else {
            console.log('Thread creation failed');
            return null;
        }
    }

    communityStore.deleteThread = async (threadId, userId) => {
        console.log('Deleting thread');
        const payload = {
            id: threadId,
            senderId: userId,
        }
        const thread = await api.deleteThread(payload);
        console.log(thread);
        if (thread.status < 400) {
            console.log('Thread deleted successfully');
            communityStore.getAllThreads();
            return thread.data;
        } else {
            console.log('Thread deletion failed');
            return null;
        }
    }

    communityStore.getAllThreads = async () => {
        console.log("Getting all threads");
        await communityStore.getPopularThreads(1);
        const threads = await api.getAllThreads();
        console.log(threads);
        if (threads.status < 400) {
            communityReducer({
                type: CommunityStoreActionType.GET_ALL_THREADS,
                payload: threads.data.threads
            })
        }
    }

    communityStore.getPostsByUser = async (userId, search) => {
        console.log("Getting all threads and replies by user");
        const posts = await api.getPostsByUser({userId:userId, search:search});
        console.log(posts);
        if (posts.status < 400) {
            return posts.data;
        } else {
            console.log('Failed to get posts by user');
            return null;
        }
    }


    communityStore.getPopularThreads = async (page, limit) => {
        console.log("Getting popular threads");
        const threads = await api.getPopularThreads({ page: page, limit: limit });
        console.log(threads);
        if (threads.status < 400) {
            communityReducer({
                type: CommunityStoreActionType.SET_TOP_THREADS,
                payload: threads.data.threads,
            });
        }
    }

    communityStore.setThreadAsTop = async (threadId) => {
        console.log('Setting thread as top');
        const thread = await api.getThreadById(threadId);
        console.log(thread);
        if (thread.status < 400) {
            console.log('Thread found');
            const threadData = [thread.data.thread];
            console.log(threadData);
            return communityReducer({
                type: CommunityStoreActionType.SET_TOP_THREADS,
                payload: threadData,
            });
        } else {
            console.log('Thread not found');
            return null;
        }
    }

    communityStore.getUserById = async (id) => {
        const user = await api.getUserById(id);
        console.log(user);
        return user.data.user;
    }

    communityStore.registerLike = async (threadId, userId) => {
        console.log("Registering like");
        let payload = {
            threadId: threadId,
            userId: userId,
        }
        console.log('in registerLike');
        console.log(payload);
        const liked = await api.registerLike(payload);
        if (liked.status < 400) {
            communityStore.getAllThreads();
        } else {
            console.log("Error registering like");
        }
    }

    communityStore.registerDislike = async (threadId, userId) => {
        console.log("Registering dislike");
        let payload = {
            threadId: threadId,
            userId: userId,
        }
        console.log('in registerDislike');
        console.log(payload);
        const disliked = await api.registerDislike(payload);
        if (disliked.status < 400) {
            communityStore.getAllThreads();
        } else {
            console.log("Error registering dislike");
        }
    }

    communityStore.setSelectedIndex = (index) => {
        console.log('Setting selected index');
        console.log('current store');
        console.log(communityStore);
        communityReducer({
            type: CommunityStoreActionType.SET_SELECTED_INDEX,
            payload: index,
        })
    }



    return (
        <CommunityStoreContext.Provider value={{ communityStore }}>
            {props.children}
        </CommunityStoreContext.Provider>
    );

}

export default CommunityStoreContext;
export { CommunityStoreContextProvider };