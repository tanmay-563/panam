declare module "*.svg" {
    // @ts-ignore
    const content: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
    export default content;
}
