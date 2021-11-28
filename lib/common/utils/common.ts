import { Request, Response, NextFunction } from "express";


export function cal_percentage (number, percentage) {
    return (number/100) * percentage;
}

export function respondBack(req: Request, res: Response) {
    if (res.locals.passedObj) {
        res.send(res.locals.passedObj);
    } else if (res.locals) {
        res.send(res.locals);
    } else {
        res.status(422).send('no passed object to respond');
    }
}

export function checkEmpty(value) {
    return (value == null || value.length === 0);
}

export function isLetter(c) {
    return c.toLowerCase() != c.toUpperCase();
}

const transformKey = async (assetKey) => {

    let newKey = '';
    for(let i = 0; i < assetKey.length; i++) {

        const char = assetKey.charAt(i)
        if (isNaN(char)) {

            newKey += '0';
        } else {
            newKey += char;
        }
    }

    return newKey;
}




const alphaVal = (s) => s.toLowerCase().charCodeAt(0) - 97 + 1;

export const createNewKey = async (assetCode) => {

    const firstIndex = alphaVal(assetCode[0]);
    const secondIndex = alphaVal(assetCode[1]);
    const endSerial = assetCode.slice(2, assetCode.length);


    let assetKey = firstIndex + secondIndex + endSerial;

    if(isNaN(assetKey)) {
        assetKey = await transformKey(assetKey);
    }

    return assetKey
}

