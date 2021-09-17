import { FETCH_USER } from "../actions/types";


export default function(state = null, action){
    switch (action.type){
        case FETCH_USER:
            //if that is an empty string or false will return the value
            return action.payload || false;
        default:
            return state;
    }

}