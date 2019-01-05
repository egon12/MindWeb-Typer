import treeMiddleware from './tree_middleware'
import CircularCalculator from './circular_calculator'

export default function mindmapProcessor(inputString) {

  const tree = treeMiddleware(inputString)

  const cc = new CircularCalculator()

  const newTree = cc.addRadians(tree)
  makePos2(newTree, 0)
  
  //level1PosX = [-10, 10]
  //makePosRecursive(tree, 0, tree)

  return makeTreeToFlat(newTree)
}

function makeTreeToFlat(tree) {

  const { id, x, y, parentId, children } = tree

  const link = parentId ? [parentId] : []

  var list = [{ id: id, name: id, x, y, color: 'steelblue', link }]

  for (let i=0; i<children.length; i++) {
    list = list.concat(makeTreeToFlat(children[i]))
  }

  return list
}


var level1PosX = [-1, 1]
function makePos(tree, level, root) {
  if (level == 0) {
    tree.x = 0;
    tree.y = 0;

    const ang = Math.PI * 2 / tree.children.length
    for (let i=0; i<tree.children.length; i++) {
      const x = Math.cos(ang * i) * 10
      const y = Math.sin(ang * i) * 10

      tree.children[i].x = x > 0 ? Math.floor(x) : Math.ceil(x)
      tree.children[i].y = y > 0 ? Math.floor(y) : Math.ceil(y)
    }

    return
  }

  if (level == 1) {
    // already set when set pos at level 0
    return
  }

  const parent = findInTree(root, tree.parentId)

  if (parent.x > 0) {
    tree.x = parent.x + 10
    tree.y = parent.y + parent.children.indexOf(tree) - Math.floor(parent.children.length / 2)
  } else {
    tree.x = parent.x - 10
    tree.y = parent.y + parent.children.indexOf(tree) - Math.floor(parent.children.length / 2)
  }
}

function makePosRecursive(tree, level, root) {
  makePos(tree, level, root)
  for (let i=0; i<tree.children.length; i++) {
    makePosRecursive(tree.children[i], level+1, tree)
  }
}

function findInTree(tree, id) {
  if (tree.id == id) {
    return tree
  }

  for (let i=0; i<tree.children.length; i++) {
    const result = findInTree(tree.children[i], id)
    if (result != null) {
      return result
    }
  }

  return null
}

function makePos2(tree, level) {
  if (level == 0) {
    tree.x = 0
    tree.y = 0
  } else {
    tree.x = Math.cos(tree.radians) * 10 * level
    tree.y = Math.sin(tree.radians) * 10 * level
  }
  tree.children.forEach(c => makePos2(c, level+1))
}

