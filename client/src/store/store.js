import { createContext, useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import api from '../api'
import AuthContext from '../auth'

export const GlobalStoreContext = createContext({});

export const GlobalStoreActionType = {
    LOAD_PUBLIC_PROJECTS: "LOAD_PUBLIC_PROJECTS"
}


function GlobalStoreContextProvider(props) {
    const navigate = useNavigate();


    // THESE ARE ALL THE THINGS OUR DATA STORE WILL MANAGE
    const [store, setStore] = useState({
        publicProjects: [],
        currentPage: "explore",
    });



    // SINCE WE'VE WRAPPED THE STORE IN THE AUTH CONTEXT WE CAN ACCESS THE USER HERE
    const { auth } = useContext(AuthContext);




    // HERE'S THE DATA STORE'S REDUCER, IT MUST
    // HANDLE EVERY TYPE OF STATE CHANGE
    const storeReducer = (action) => {
        const { type, payload } = action;
        switch (type) {

            // GET ALL PUBLIC PROJECTS SO WE CAN PRESENT THEM IN EXPLORE SCREEN
            case GlobalStoreActionType.LOAD_PUBLIC_PROJECTS: {
                return setStore({
                    publicProjects: payload,
                    currentPage: store.currentPage
                });
            }

            default:
                return store;
        }
    }






    // THESE ARE THE FUNCTIONS THAT WILL UPDATE OUR STORE AND
    // DRIVE THE STATE OF THE APPLICATION. WE'LL CALL THESE IN 
    // RESPONSE TO EVENTS INSIDE OUR COMPONENTS.


    store.loadPublicProjects = async function () {

        // Ahnaf is writing the getAllPublicProjects in the backend
        const response = await api.getAllPublicProjects();
        if (response.data.success) {
            let publicProjects = response.data.top5lists;
            storeReducer({
                type: GlobalStoreActionType.LOAD_PUBLIC_PROJECTS,
                payload: publicProjects
            });
        } else {
            console.log("API FAILED TO GET THE LIST PAIRS");
        }

    }

    return (
        <GlobalStoreContext.Provider value={{
            store
        }}>
            {props.children}
        </GlobalStoreContext.Provider>
    );
}

export default GlobalStoreContext;
export { GlobalStoreContextProvider };

