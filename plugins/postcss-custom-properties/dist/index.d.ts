import type { PluginCreator } from 'postcss';
/** postcss-custom-properties plugin options */
export declare type pluginOptions = {
    /** Preserve the original notation. default: true */
    preserve?: boolean;
};
declare const creator: PluginCreator<pluginOptions>;
export default creator;