import mindmapProcessor from './mindmap_processor.js'

test('Should create tree from indented string', () => {

  var expected = [
    { id: 'Root', name: 'Root', x: 0, y: 0, color: 'steelblue', link: [ ] },
    { id: 'RootChild1', name: 'RootChild1', x: 1, y: 0, color: 'steelblue', link: [ 'Root'  ] },
    { id: 'ChildFrom1_1', name: 'ChildFrom1_1', x: 2, y: -1, color: 'steelblue', link: [ 'RootChild1'  ] },
    { id: 'ChildFrom1_2', name: 'ChildFrom1_2', x: 2, y:  0, color: 'steelblue', link: [ 'RootChild1'  ] },
    { id: 'ChildFrom1_3', name: 'ChildFrom1_3', x: 2, y:  1, color: 'steelblue', link: [ 'RootChild1'  ] },

    { id: 'RootChild2', name: 'RootChild2', x: -1, y: 0, color: 'steelblue', link: [ 'Root'  ] },
    { id: 'ChildFrom2_1', name: 'ChildFrom2_1', x: -2, y: -1, color: 'steelblue', link: [ 'RootChild2'  ] },
    { id: 'ChildFrom2_2', name: 'ChildFrom2_2', x: -2, y:  0, color: 'steelblue', link: [ 'RootChild2'  ] },
    { id: 'ChildFrom2_3', name: 'ChildFrom2_3', x: -2, y:  1, color: 'steelblue', link: [ 'RootChild2'  ] },
  ]

  const input = `
Root
  RootChild1
    ChildFrom1_1
    ChildFrom1_2
    ChildFrom1_3
  RootChild2
    ChildFrom2_1
    ChildFrom2_2
    ChildFrom2_3
`;
  expect(mindmapProcessor(input)).toEqual(expected);
});


