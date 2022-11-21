import { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import AuthContext from '../auth/auth';

export const CommunityStoreContext = createContext({});

export const CommunityStoreActionType = {
    GET_ALL_THREADS: 'GET_ALL_THREADS',
    SET_TOP_THREADS: 'SET_TOP_THREADS',
    REGISTER_LIKE: 'REGISTER_LIKE',
    LOAD_REPLIES: 'LOAD_REPLIES'
}

const CommunityStoreContextProvider = (props) => {
    const navigate = useNavigate();

    const [communityStore, setCommunityStore] = useState({
        ALL_THREADS: [],
        TOP_THREADS: [],
        replies: [],
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
            case CommunityStoreActionType.LOAD_REPLIES: {
                return setCommunityStore({
                    ...communityStore,
                    replies: payload
                })
            }
            default:
                return communityStore;
        }
    }

    communityStore.getAllThreads = async () => {
        console.log("Getting all threads");
        await communityStore.getPopularThreads(1,5);
        const threads = await api.getAllThreads();
        console.log(threads);
        if (threads.success) {
            communityReducer({
                type: CommunityStoreActionType.GET_ALL_THREADS,
                payload: threads.data.threads
            })
        }
    }

    communityStore.getPopularThreads = async (page, limit) => {
        console.log("Getting popular threads");
        const threads = await api.getPopularThreads({page:page,limit:limit});
        console.log(threads);
        if (threads.data.success) {
            communityReducer({
                type: CommunityStoreActionType.SET_TOP_THREADS,
                payload: threads.data.threads,
            });
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
        if (liked.status === 200) {
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
        if (disliked.status === 200) {
            communityStore.getAllThreads();
        } else {
            console.log("Error registering dislike");
        }
    }

    communityStore.loadReplies = async function () {

        // Ahnaf is writing the getAllPublicProjects in the backend
        const response = await api.getAllReplies();
        console.log(response);
        if (response.data.success) {
            let replies = response.data.replies;
            communityReducer({
                type: CommunityStoreActionType.LOAD_REPLIES,
                payload: replies
            });
        } else {
            console.log("API FAILED TO GET THE REPLIES");
        }

    }

    communityStore.getReplybyId = async (id) => {
        const reply = await api.getReplybyId(id);
        console.log(reply);
        return reply.data.reply;
    }

    communityStore.addReply = async function (replyToId, ownerId, text) {
        console.log("handling add reply in store...")
        let payload = {
            replyingTo: replyToId,
            senderId: ownerId,
            replyMsg: text
        };
        let response = await api.addReply(payload)
        console.log(response)

        let response1 = await api.getAllReplies();
        if (response1.data.success) {
            let replies = response1.data.replies;
            communityReducer({
                type: CommunityStoreActionType.LOAD_REPLIES,
                payload: replies
            });
        } else {
            console.log("API FAILED TO GET THE REPLIES");
        }
    }

    return (
        <CommunityStoreContext.Provider value={{ communityStore }}>
            {props.children}
        </CommunityStoreContext.Provider>
    );

}

export default CommunityStoreContext;
export { CommunityStoreContextProvider };