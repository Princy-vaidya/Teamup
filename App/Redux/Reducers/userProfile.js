import { PROFILES } from '../type'

export default function (state = [], action) {
    switch (action.type) {
        case PROFILES:
            return action.payload;
        default:
    }
    return state
}
