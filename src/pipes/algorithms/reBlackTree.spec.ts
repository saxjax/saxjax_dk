import { RedBlackTree, RedBlackNode } from './redBlackTree';
import { ComponentFixture, TestBed } from '@angular/core/testing';


describe('RedBlackTree', () => {
  let tree = new RedBlackTree();

  beforeEach(async () => {
    tree = new RedBlackTree();
  });

  it('should have undefined rootnode initial value ', () => {
    // Arrange

    // Act

    // Assert
    expect(tree.rootNode).toBe(undefined)
  });

describe('isEqualTo',()=>{
    const primaryNode: RedBlackNode<number> = {value:1,right:undefined,left:undefined} as RedBlackNode<number>
      const equalNode: RedBlackNode<number> = {value:1,right:undefined,left:undefined} as RedBlackNode<number>
      const greaterNode: RedBlackNode<number> = {value:2,right:undefined,left:undefined} as RedBlackNode<number>
    it('should return true when two nodes are equal',()=>{
      //Arrange Act
      const result = tree.isEqualTo(primaryNode,equalNode)

      //Assert
      expect(result).toEqual(true)
    })

    it('should return false when two nodes are different',()=>{
      //Arrange Act
      const result = tree.isEqualTo(primaryNode,greaterNode)

      //Assert
      expect(result).toEqual(false)
    })
})

describe('isGreaterThan',()=>{
  const primaryNode: RedBlackNode<number> = {value:1,right:undefined,left:undefined} as RedBlackNode<number>
    const equalNode: RedBlackNode<number> = {value:1,right:undefined,left:undefined} as RedBlackNode<number>
    const greaterNode: RedBlackNode<number> = {value:2,right:undefined,left:undefined} as RedBlackNode<number>
    const lesserNode: RedBlackNode<number> = {value:0,right:undefined,left:undefined} as RedBlackNode<number>
  it('should return true when primary is greater than secondary node',()=>{

    //Arrange Act
    const result = tree.isGreaterThan(primaryNode,greaterNode)

    //Assert
    expect(result).toEqual(true)
  })
  it('should return false when primary is lesser than secondary node',()=>{

    //Arrange Act
    const result = tree.isEqualTo(primaryNode,lesserNode)

    //Assert
    expect(result).toEqual(false)
  })

  it('should return false when primary is equal to secondary node',()=>{

    //Arrange Act
    const result = tree.isEqualTo(primaryNode,equalNode)

    //Assert
    expect(result).toEqual(false)
  })
})

describe('isGreaterThan',()=>{
  const primaryNode: RedBlackNode<number> = {value:1,right:undefined,left:undefined} as RedBlackNode<number>
    const equalNode: RedBlackNode<number> = {value:1,right:undefined,left:undefined} as RedBlackNode<number>
    const greaterNode: RedBlackNode<number> = {value:2,right:undefined,left:undefined} as RedBlackNode<number>
    const lesserNode: RedBlackNode<number> = {value:0,right:undefined,left:undefined} as RedBlackNode<number>
  it('should return true when primary is lesser than secondary node',()=>{
    //Arrange Act
    const result = tree.isLessThan(primaryNode,lesserNode)

    //Assert
    expect(result).toEqual(true)
  })
  it('should return false when primary is greater than secondary node',()=>{
    //Arrange Act
    const result = tree.isLessThan(primaryNode,greaterNode)

    //Assert
    expect(result).toEqual(false)
  })

  it('should return false when primary is equal to secondary node',()=>{
    //Arrange Act
    const result = tree.isEqualTo(primaryNode,equalNode)

    //Assert
    expect(result).toEqual(false)
  })
})

describe('findNode',()=>{
    const primaryNode: RedBlackNode<number> = {id: 0 ,value:1,right:undefined,left:undefined} as RedBlackNode<number>
    const greaterNode: RedBlackNode<number> = {id: 2 ,value:2,right:undefined,left:undefined} as RedBlackNode<number>
    const lesserNode: RedBlackNode<number> = {id: 3 ,value:0,right:undefined,left:undefined} as RedBlackNode<number>

    const equalNode: RedBlackNode<number> = {id: 1 ,value:1,right:undefined,left:undefined} as RedBlackNode<number>
    const notInTreeNode: RedBlackNode<number> = {id: 4 ,value:10,right:undefined,left:undefined} as RedBlackNode<number>


    primaryNode.right = greaterNode.right
    primaryNode.left = lesserNode.left
    tree.rootNode = primaryNode
  it('should return tree-node when node can be found in tree',()=>{

    // Act
    const result1 = tree.findNode(equalNode)
    const result2 = tree.findNode(greaterNode)
    const result3 = tree.findNode(lesserNode)

    // Assert
    expect(result1?.id).toEqual(primaryNode.id)
    expect(result2?.id).toEqual(greaterNode.id)
    expect(result3?.id).toEqual(lesserNode.id)
  })

  it('should return undefined when node can not be found in tree',()=>{
    // Act
    const result1 = tree.findNode(notInTreeNode)

    // Assert
    expect(result1).toEqual(undefined)
  })
})

describe('insert',()=>{
  const primaryNode: RedBlackNode<number> = {id: 0 ,value:1,right:undefined,left:undefined} as RedBlackNode<number>
  const greaterNode: RedBlackNode<number> = {id: 2 ,value:2,right:undefined,left:undefined} as RedBlackNode<number>
  const lesserNode: RedBlackNode<number> = {id: 3 ,value:0,right:undefined,left:undefined} as RedBlackNode<number>

  const equalNode: RedBlackNode<number> = {id: 1 ,value:1,right:undefined,left:undefined} as RedBlackNode<number>
  const notInTreeNode: RedBlackNode<number> = {id: 4 ,value:10,right:undefined,left:undefined} as RedBlackNode<number>

  primaryNode.right = greaterNode.right
  primaryNode.left = lesserNode.left
  tree.rootNode = primaryNode

  it('should insert id 4 in tree',()=>{

    // Act
    const resultBeforeInsert = tree.findNode(notInTreeNode)
    expect(resultBeforeInsert).toBeFalse()

    tree.insert(notInTreeNode)

    // Assert
    const resultAfterInsert = tree.findNode(notInTreeNode)
    expect(resultAfterInsert?.id).toEqual(notInTreeNode.id)
  })

})

});
