declare module 'react-twemoji' {
    import React from 'react';

    export interface TwemojiProps {
        tag?: string;
        noWrapper?: boolean;
        options?: {
            callback?: Function,   // default the common replacer
            attributes?: Function, // default returns {}
            base?: string,         // default MaxCDN
            ext?: string,          // default ".png"
            className?: string,    // default "emoji"
            size?: string|number,  // default "72x72"
            folder?: string        // in case it's specified
        };
    }
    
    declare const Twemoji: React.SFC<TwemojiProps>
    
    export default Twemoji
}