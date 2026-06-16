import { createListenerMiddleware, addListener, isAnyOf } from '@reduxjs/toolkit'
import type { RootState, AppDispatch } from './createStore'
import { useDispatch } from 'react-redux'
import {UnsubscribeListener} from '@reduxjs/toolkit'

const listenerMiddleware = createListenerMiddleware();
const startAppListening = listenerMiddleware.startListening.withTypes<
    RootState,
    AppDispatch
>();
const useAppDispatch = useDispatch.withTypes<AppDispatch>();
const addAppListener = addListener.withTypes<RootState, AppDispatch>();

export {
    listenerMiddleware,
    startAppListening,   
    useAppDispatch,
    addAppListener,
    isAnyOf,
}
export type {
    UnsubscribeListener
}