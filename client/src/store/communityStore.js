import { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import AuthContext from '../auth/auth';

export const CommunityStoreContext = createContext({});

export const CommunityStoreActionType = {
    GET_ALL_THREADS: 'GET_ALL_THREADS',
    SET_TOP_THREADS: 'SET_TOP_THREADS',
}

const CommunityStoreContextProvider = (props) => {
    const navigate = useNavigate();

    const [communityStore, setCommunityStore] = useState({
        ALL_THREADS: [],
        TOP_THREADS: [],
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
                return setCommunityStore({
                    ...communityStore,
                    TOP_THREADS: payload,
                });

            default:
                return communityStore;
        }
    }

    communityStore.getAllThreads = async () => {
        console.log("Getting all threads");
        const threads = await api.getAllThreads();
        console.log(threads);
        if (threads.success) {
            communityReducer({
                type: CommunityStoreActionType.GET_ALL_THREADS,
                payload: threads.data.threads
            })
        }
        if (communityStore.TOP_THREADS.length === 0) {
            communityReducer({
                type: CommunityStoreActionType.SET_TOP_THREADS,
                payload: threads.data.threads,
            });
        }
    }

    communityStore.getUserById = async (id) => {
        console.log("Getting user by id");
        console.log(id);
        const user = await api.getUserById(id);
        console.log(user);
        return user.data.user;
    }



    return (
        <CommunityStoreContext.Provider value={{ communityStore }}>
            {props.children}
        </CommunityStoreContext.Provider>
    );

}

export default CommunityStoreContext;
export { CommunityStoreContextProvider };