export function init(params: any): typeof functions;
declare namespace functions {
    function getMailHash(email: any): any;
    function getMail(email: any): string;
    function lookup(userArray: any, mailToLookup: any): Promise<any>;
    function verify(email: any, password: any, passwordHash: any): Promise<boolean>;
    function signup(email: any, password: any): Promise<{
        email: string;
        passwordHash: string;
        emailHash: any;
    }>;
}
export {};
//# sourceMappingURL=index.d.ts.map