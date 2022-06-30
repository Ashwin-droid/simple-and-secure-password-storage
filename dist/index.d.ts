export function init(params: any): typeof functions;
declare namespace functions {
    function getmail(email: any): string;
    function lookup(userArray: any, mailTolookup: any): Promise<any>;
    function verify(email: any, password: any, passwordHash: any): Promise<boolean>;
    function signup(email: any, password: any): Promise<{
        email: string;
        passwordHash: string;
        emailHash: string;
    }>;
}
export {};
//# sourceMappingURL=index.d.ts.map