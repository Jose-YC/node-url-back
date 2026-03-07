export class ToBase62 {
    private static readonly BASE62 = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

    static convert(num: bigint): string {
        let bigNum = BigInt(num);
        let result = '';

        while (bigNum > 0n) {
            result = this.BASE62[Number(bigNum % 62n)] + result;
            bigNum = bigNum / 62n;
        }

        return result || '0';
    }
}