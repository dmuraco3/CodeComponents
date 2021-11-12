import { NextComponentType, NextPage } from "next";
import { AppProps } from "next/app";

export type AuthedPage = NextPage & {
  needsAuth: boolean;
};


export type AuthedPageProps = AppProps & {
    Component:  NextComponentType & {
        needsAuth: boolean;
    };

}