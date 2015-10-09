#FlowChart Typer

###Introduction

Ok, I made this FlowChartTyper because ussualy I need to built to make some 
flow chart. But it is painful to draw using mouse. Because mainly I type. 
Maybe it's odd but a litle bit hate mouse for productive. (Can you guess 
what is my windows Environment is?)

###Create Box
Ok how to draw by typing?

Its easy type the node text seperate by newline like

    one
    two
    three

And you can see it will create three box with the name.

###Set The Position
And how set the position? Go ahead and type

    one;0;0
    two;1;1
    three;2;2

And it will create diagonal box. Basicly the second and the third variable
are position in space. You don't have to heavily think of the coordinate. 
This program will calculate the real coordinate for you. Just think like node
"two" is in the right and bottom so it has to be larger than coordinate node
"one"

###Connecting the node

Now what if we want to connect the node? It easy just add the node name after the
third variable Like

    one;0;0,two,three
    two;1;1
    three;2;2

Or if not using the coordinate you can type the node name next to the name like

    one;two;three
    two;1;1
    three;0;1

If you see this, there will be a problem is the node are not unique. So make sure
the node make sure the node are unique

##Advance Using

Still not fast enough to create flow chart? Well you can use some of this trick

###Two Variable set X

Suppose you want to build double 4 vertically box. You can do like this

    one
    two
    three

    un,1
    deuce
    thres

Easy right? If you want to know the logic, here it is.

The default coordinate (x,y) of first object are (0,0). When we create second 
object without coordinate variable, it will add lock the x variable. And add 
1 (one) to y variable so it will be (0,1). And the third object it will be same.

When we set with two variable, name and x, it will lock the x, and set the y
back to the 0

 






