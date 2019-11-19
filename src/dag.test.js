import DAG from './dag'

test("normal operation", () => {

    const content = "Base\nCommon Base\nAccount Common\nMessage Account Common\nCall Account Common"

    const dag = new DAG()

    const r = dag.process(content) 
    expect(r.find(i => i.id == "Base").y).toBe(0)
    expect(r.find(i => i.id == "Account").y).toBe(20)
    expect(r.find(i => i.id == "Message").x).toBe(1)
    expect(r.find(i => i.id == "Call").x).toBe(2)

})

test("node link to itself", () => {

    const content = "Base\nCommon Base\nAccount Common Account\n"

    const dag = new DAG()

    expect(() => dag.process(content)).toThrow("Account cannot link to it self")
})

test("cyclic link ", () => {

    const content = "Base\nCommon Base\nAccount Common Comment\nPost Account\nComment Post\n"

    const dag = new DAG()

    expect(() => dag.process(content)).toThrow("Possible cyclic link in Account, Post, Comment")
})


test("link not available ", () => {

    const content = "Base\nCommon Base\nAccount Common\nPost Account\nComment post\n"

    const dag = new DAG()

    expect(() => dag.process(content)).toThrow("Cannot find link to post")
})

test("should have meta", () => {

    const content = "Base | meta1\nCommon Base | meta2\nAccount Common\nMessage Account Common\nCall Account Common"

    const dag = new DAG()

    const r = dag.process(content) 
    expect(r.find(i => i.id == "Base").meta).toBe("meta1")
    expect(r.find(i => i.id == "Common").meta).toBe("meta2")
})

test("should have color", () => {

    const content = "Base | green\nCommon Base\nAccount Common | not_color \nMessage Account Common\nCall Account Common"

    const dag = new DAG()

    const r = dag.process(content) 
    expect(r.find(i => i.id == "Base").color).toBe("green")
    expect(r.find(i => i.id == "Common").color).toBe("steelblue")
    expect(r.find(i => i.id == "Account").color).toBe("steelblue")
})
