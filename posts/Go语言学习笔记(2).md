---
title: Go语言学习笔记 - 变量、指针、类型
date: 2018-05-04 21:46:55
category: Go语言
---

### 变量

在Go语言中，变量声明的完整语法如下：

```go
var 变量名字 类型 = 表达式
```

其中“类型”或“= 表达式”两个部分可以选择性的省略一个。如果省略的是类型信息，那么将根据初始化表达式来推导变量的类型信息。如果初始化表达式被省略，那么将用零值初始化该变量。以下列出了各类型零值的值：

- 数值：0
- 布尔：false
- 字符串：空字符串
- 接口/引用类型：nil
- 聚合类型（数组或结构体）：每个元素或字段是其对应类型的零值

零值初始化机制确保每个声明的变量总是有一个良好定义的值，因此在Go语言中不存在未初始化的变量。
<!--more-->

可以在一个声明语句中同时声明一组变量。如果省略每个变量的类型，将可以声明多个类型不同的变量（类型由初始化表达式推导）：

```go
var i, j, k int                 // int, int, int
var b, f, s = true, 2.3, "four" // bool, float64, string
var f, err = os.Open(name)      // os.Open returns a file and an error
```

在Go语言中，还有另外一种**简短变量声明**的方式，变量的类型根据表达式来自动推导：

```go
名字 := 表达式
```

例如：

```go
anim := gif.GIF{LoopCount: nframes}
freq := rand.Float64() * 3.0
t := 0.0
```

简短变量声明被广泛用于大部分的局部变量的声明和初始化。var形式的声明语句往往用于需要显式指定变量类型的地方，或者因为变量稍后会被重新赋值而初始值无关紧要的地方。

简短变量声明语句也可以用来声明和初始化一组变量：

```go
i, j := 0, 1
```

请注意`:=`与`=`的区别：前者是一个变量声明语句，后者是一个变量赋值操作。

还有一点需要注意：简短变量声明左边的变量如果在**相同的词法域**声明过，那么此时对该变量就只有赋值操作了。在下面的代码中，第二个语句只声明了out一个变量，然后对已经声明的err进行了赋值操作：

```go
in, err := os.Open(infile)
// ...
out, err := os.Create(outfile)
```

请注意，这一条规则只对相同词法域的变量有效，如果变量是在外部词法域声明的，那么简短变量声明语句将会在当前词法域重新声明一个新的变量。

另外，简短变量声明语句中必须至少声明一个新的变量才能通过编译：

```go
f, err := os.Open(infile)
// ...
f, err := os.Create(outfile) // 编译错误
```

### 指针

一个变量对应着它对应类型值的内存空间。当我们读取一个变量时，读取的是该变量在内存空间中所存储的值。

而一个指针的值代表了某一个变量在内存中的地址。通过指针，我们知道变量所在的内存地址，并且可以直接读取或更新该变量的值，并且不需要知道变量的名字。

如果我们用`var x int`语句声明一个x变量，那么`&x`表达式（`&`操作符为取地址）将产生一个指向该整数变量的指针，指针对应的数据类型是`*int`，我们称之为“指向int类型的指针”。请看下面的示例：

```go
x := 1          // int
p := &x         // p, of type *int, points to x
fmt.Println(*p) // "1"
*p = 2          // equivalent to x = 2
fmt.Println(x)  // "2"
```

表达式`p := &x`产生了一个指向变量x的指针，并且将指针赋值给p。我们可以说“p指针指向变量x”，或者说“p指针保存了变量x的内存地址”。`*p`表达式（`*`操作符可以理解为寻址，与`&`操作符对应）指向变量x的值。

在Go语言中，返回函数中局部变量的地址也是安全的。例如下面的代码，调用f函数时创建局部变量v，在局部变量地址被返回之后依然有效：

```go
var p = f()

func f() *int {
    v := 1
    return &v
}
```

因为指针包含的是变量的地址，那么在调用函数将指针作为参数，就可以在函数中通过该指针来更新变量的值：

```go
func incr(p *int) int {
    *p++ // 非常重要：只是增加p指向的变量的值，并不改变p指针！！！
    return *p
}

v := 1
incr(&v)              // side effect: v is now 2
fmt.Println(incr(&v)) // "3" (and v is 3)
```

### new函数

Go语言中内建的new函数可以用来创建变量。表达式`new(T)`将创建一个T类型的匿名变量，初始化为T类型的零值，然后返回*T类型的指针。

```go
p := new(int)   // p, *int 类型, 指向匿名的 int 变量
fmt.Println(*p) // "0"
*p = 2          // 设置 int 匿名变量的值为 2
fmt.Println(*p) // "2"
```

使用new创建变量时，变量为匿名的。除此之外与一般声明创建的变量没有区别。

### 变量的生命周期与垃圾回收

对于包级别声明的变量来说，它们的生命周期和整个程序的运行周期是一致的。相比之下，局部变量的声明周期则是动态的：从每次创建一个新变量的声明语句开始，直到该变量不再被引用为止，然后变量的存储空间可能被回收。

那么Go语言的垃圾收集机制如何知道一个变量何时可以被回收呢？我们先避开完整的技术细节，基本的实现思路是，对于某个变量来说，从每个包级的变量和每个当前运行函数的每一个局部变量开始，通过指针或引用的访问路径遍历，是否可以找到该变量。如果不存在这样的访问路径，那么说明该变量是不可达的，它的存在与否不影响后续程序的计算结果，因而是可以被回收的。

理解了上面一点之后，我们可以推断：一个循环迭代内部的局部变量的生命周期可能超出其局部作用域。比如我们在循环体中将局部变量赋值给了外部作用域的变量。

Go语言的垃圾收集器已经在内存管理方面做了大部分工作，但是并不代表着编写程序时完全不用考虑内存了。例如，将指向短生命周期对象的指针保存到具有长生命周期的对象中时（特别是保存到全局变量中），会阻止对短生命周期对象的垃圾回收，从而可能影响程序的性能。

### 类型

一个类型声明语句创建了一个新的类型名称。它的语法如下：

```go
type 类型名字 底层类型
```

类型声明语句一般出现在包一级，因此如果新创建的类型名字的首字符大写，则在外部包也可以使用。

所声明的新类型拥有一个新的类型名称，和声明中的底层类型具有相同的结构，但是在概念上它们是不同的：

```go
type myint int
```

类型`myint`与`int`具备相同的结构（整型），但是他们是不同的类型，它们不可以被比较或是互相赋值。我们甚至可以为`myint`类型添加它独有的方法，而`int`类型将不具备该方法：

```go
func (mi myint) typename() myint { return "type is myint" }
```

myint类型的参数mi出现在了函数名的前面，表示声明的是myint类型的一个叫名叫typename的方法，它返回了类型名称的信息`"type is myint"`。

对于每一个类型T，都有一个对应的类型转换操作T(x)，用于将x转为T类型。只有当两个类型的**底层基础类型相同时，或是两者都是指向相同底层结构的指针类型时**，才允许这种转型操作，这些转换只改变类型而不会影响值本身。

底层数据类型决定了内部结构和表达方式，也决定是否可以像底层类型一样对内置运算符的支持。例如我们自定义一个float类型：

```go
type myfloat float64

func main() {
    var x myfloat = 1.0
    var y myfloat = 2.0
    fmt.Printf("%v\n", y - x) // 1.0
}
```

myfloat类型的底层数据类型是float64，因此它也可以进行减法运算。

### 说明及参考资料

- 文章中部分示例代码上有一行标记，利用这些标记可从[gopl.io](http://www.gopl.io/)获取源代码。例如：标记`gopl.io/ch1/helloworld`可使用命令`go get gopl.io/ch1/helloworld`获取示例源代码）

- 参考自 [The Go Programming Language 中文版](https://legacy.gitbook.com/book/yar999/gopl-zh/details)