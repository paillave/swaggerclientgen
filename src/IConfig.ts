export default interface IConfig {
    inputUri: string;
    transformations: {
        [key: string]: string;
    };
}