
export enum RedBlackColor{
  RED = 0,
  BLACK = 1
}

export interface RedBlackNode<T>{
  id:number
  color:RedBlackColor
  value:T
  left?:RedBlackNode<T>
  right?:RedBlackNode<T>

}
export class RedBlackTree<T>{
  rootNode?:RedBlackNode<T> = undefined;


  findNode = (input:RedBlackNode<T>,nodeToCompareWith?:RedBlackNode<T>): RedBlackNode<T> | undefined =>{
    if (nodeToCompareWith === undefined){ return undefined}
    if (this.isEqualTo(input.value,nodeToCompareWith.value)){return nodeToCompareWith}
    if (this.isLessThan(input.value,nodeToCompareWith.value)){return this.findNode(input,nodeToCompareWith.left) ?? nodeToCompareWith}
    if (this.isGreaterThan(input.value,nodeToCompareWith.value)){return this.findNode(input,nodeToCompareWith.right) ?? nodeToCompareWith}
    return undefined
  }

  isGreaterThan = (input:T,compareTo:T):boolean =>  input > compareTo;
  isLessThan = (input:T,compareTo:T):boolean =>  input < compareTo;
  isEqualTo = (input:T,compareTo:T):boolean =>  input === compareTo;

  insert = (value:T) => {
    const node = {value:value,left:undefined,right:undefined,color:RedBlackColor.BLACK} as RedBlackNode<T>
  }

}
