import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
    persistStore,
    persistReducer,
    createMigrate,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
// import { setupListeners } from '@reduxjs/toolkit/query'
import CONFIG from "../../config";
import migrations from "./migrations";
import searchReducer from "./slices/search";
import uiReducer from "./slices/ui";
import widgetsReducer from "./slices/widgets";
import userReducer from "./slices/user";
import viewsRedeucer from "./slices/views";
import { alphadayApi, coingeckoApi, zapperApi, ipApi } from "../services";

const rootReducer = combineReducers({
    search: searchReducer,
    ui: uiReducer,
    user: userReducer,
    views: viewsRedeucer,
    widgets: widgetsReducer,
    [alphadayApi.reducerPath]: alphadayApi.reducer,
    [coingeckoApi.reducerPath]: coingeckoApi.reducer,
    [zapperApi.reducerPath]: zapperApi.reducer,
    [ipApi.reducerPath]: ipApi.reducer,
});

const persistConfig = {
    key: CONFIG.APP.STORAGE_KEY,
    version: CONFIG.APP.STORAGE_VERSION,
    storage,
    migrate: createMigrate(migrations, { debug: true }),
    blacklist: [
        alphadayApi.reducerPath,
        coingeckoApi.reducerPath,
        zapperApi.reducerPath,
        ipApi.reducerPath,
    ],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// we can remove persistor using previous config:
// export const store = configureStore({
//     reducer: rootReducer,
// });

// Adding the api middleware enables caching, invalidation, polling,
// and other useful features of `rtk-query`.
export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [
                    FLUSH,
                    REHYDRATE,
                    PAUSE,
                    PERSIST,
                    PURGE,
                    REGISTER,
                ],
            },
        })
            .concat(alphadayApi.middleware)
            .concat(coingeckoApi.middleware)
            .concat(zapperApi.middleware)
            .concat(ipApi.middleware),
});

export const persistor = persistStore(store);

// optional, but required for refetchOnFocus/refetchOnReconnect behaviors
// see `setupListeners` docs - takes an optional callback as the 2nd arg for customization
// setupListeners(store.dispatch)

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
