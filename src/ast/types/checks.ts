import { Type } from "../types";
import { NumberType } from "./number";
import { BooleanType } from "./boolean";
import { Binary } from "../expressions";

export function areCompatible(left: Type, right: Type) {
    return ((left instanceof NumberType) && (right instanceof NumberType))
    || ((left instanceof BooleanType) && (right instanceof BooleanType));
}

export function combineTypes(leftType: Type, rightType: Type) {
    return leftType;
}

export function areEqualityCompatible(left: Type, right: Type) {
    // at the moment, equality compatibility is the same as
    // general compatibility
    return areCompatible(left, right);
}

export function areComparisonCompatible(left: Type, right: Type) {
    // at the moment, comparison compatibility is the same as
    // calculation compatibility
    return areCalculationCompatible(left, right);
}

export function areCalculationCompatible(left: Type, right: Type) {
    return (left instanceof NumberType) && (right instanceof NumberType);
}
