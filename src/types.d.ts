/**
 * Global variables provided by 3rd poarty libss
 */
declare let sceditor: any;

declare module '*.scss';
declare module '*.css';

declare module '*.svg' {
  const content: string;
  export default content;
}
