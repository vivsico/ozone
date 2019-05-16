import { BehaviorSubject } from "rxjs";
import { asBehavior } from "../observables";

import { Gateway, getGateway } from "../api/interfaces";

import { AuthUserDTO } from "../api/models/AuthUserDTO";

import { mainStore } from "./MainStore";
import { AuthenticationError } from "../api/errors";
import { isNil } from "../utility";
import { env } from "../environment";

export enum AuthStatus {
    PENDING,
    LOGGED_IN,
    LOGGED_OUT
}

export class AuthStore {
    private readonly gateway: Gateway;

    private readonly status$ = new BehaviorSubject(AuthStatus.PENDING);
    private readonly user$ = new BehaviorSubject<AuthUserDTO | null>(null);

    constructor(gateway?: Gateway) {
        this.gateway = gateway || getGateway();
    }

    user = () => asBehavior(this.user$);
    status = () => asBehavior(this.status$);

    logout = () => {
        this.gateway
            .logout()
            .then(() => {
                window.open(env().logout.logoutUrl, "_self");
            })
            .catch(() => {
                // TODO: Error handling
            });
    };

    check = () => {
        this.gateway
            .getLoginStatus()
            .then((result) => {
                this.onAuthenticateSuccess(result.data);
            })
            .catch(this.onAuthenticationFailure);
    };

    private onAuthenticateSuccess = (user: AuthUserDTO) => {
        mainStore.setTheme(user.theme);
        this.user$.next(user);
        this.status$.next(AuthStatus.LOGGED_IN);
    };

    private onAuthenticationFailure = (ex: Error) => {
        this.user$.next(null);
        this.status$.next(AuthStatus.LOGGED_OUT);
        if (!isUnauthorized(ex)) {
            console.error(`Authentication failure: ${ex}`);
        }
    };
}

export const authStore = new AuthStore();

function isUnauthorized(error: Error): boolean {
    return error instanceof AuthenticationError && !isNil(error.cause.response) && error.cause.response.status === 401;
}
