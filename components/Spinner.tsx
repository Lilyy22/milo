'use client'

import React from "react";
import { Blocks } from "react-loader-spinner";

export default function Spinner({ isDistanceLimit }: { isDistanceLimit?: boolean }) {
    return (
        <div className={`absolute left-0 right-0 top-0 bottom-0 flex justify-center ${isDistanceLimit ? 'top-0' : 'items-center'}`}>
            <Blocks
                height="80"
                width="80"
                color="#4fa94d"
                ariaLabel="blocks-loading"
                wrapperClass="blocks-wrapper"
                visible={true}
            />
        </div>
    );
}
