
### Go语言起源

> 在UINX和C语言发明40年之后，目前已经在Google工作的Ken Thompson（UNIX发明者之一）和Rob Pike（在贝尔实验室时就是Ken Thompson的同事）、还有Robert Griesemer（设计了V8引擎和HotSpot虚拟机）一起合作，为了解决在21世纪多核和网络化环境下越来越复杂的编程问题而发明了Go语言。

Go语言有时候被描述为“C类似语言”，或者是“21世纪的C语言”。Go从C语言继承了相似的表达式语法、控制流结构、基础数据类型、调用参数传值、指针等很多思想，还有C语言一直所看中的编译后机器码的运行效率以及和现有操作系统的无缝适配。
<!--more-->
但是在Go语言的家族树中还有其它的祖先。Go语言区别其他语言的一项重要特性 —— 并发与管道通信，灵感来自于贝尔实验室的Tony Hoare于1978年发表的鲜为外界所知的关于并发研究的基础文献顺序通信进程（communicating sequential processes，缩写为CSP）。在CSP中，程序是一组中间没有共享状态的平行运行的处理过程，它们之间使用管道进行通信和控制同步。

### Hello World

让我们从最传统的"hello world"案例开始吧。

`gopl.io/ch1/helloworld`

```go
package main

import "fmt"

func main() {
	fmt.Println("Hello, 世界")
}
```

Go是一门编译型语言，Go语言的工具链将源代码及其依赖转换成计算机的机器指令。Go语言提供的工具都通过一个单独的命令`go`调用。最简单的一个子命令就是`run`。这个命令编译一个或多个以.go结尾的源文件，链接库文件，并运行最终生成的可执行文件。

```bash
$ go run helloworld.go
```

结果毫无意外：

```bash
Hello, 世界
```

如果想要编译并生成可执行的二进制文件，使用子命令`build`：

```bash
$ go build helloworld.go
```

这个命令会生成一个名为helloworld的可执行二进制文件。请放心，执行文件的所有依赖都被编译在了文件之中，之后你可以随时运行它，不需任何处理。

现在来简要说明一下上面的程序。

- 每个源文件以一条`package`声明开始，这里是`package main`，表示该文件属于哪个包。
- main包比较特殊。它定义了一个独立可执行的程序，而不是一个库。在main包里的main函数也很特殊，它是整个程序执行时的入口。
- 紧接在`package`声明之后的是`import`语句，表明需要导入的包。本例导入了"fmt"包，它是Go标准库中的一个包，"fmt"包含有格式化输出、接收输入等函数。
- 再接下来是储存在文件里的程序语句。本例中声明了main函数，并在函数中调用了"fmt"包中的函数。
- Go语言不需要在语句或者声明的末尾添加分号，除非一行上有多条语句。编译器会主动把特定符号后的换行符转换为分号，因此换行符添加的位置会影响Go代码的正确解析。举例来说，函数的左括号`{`必须和`func`函数声明在同一行且处于末尾，不能另起一行。
- 因为上一条的原因，Go语言在代码的格式上采取了强硬的态度。官方的**gofmt**工具可以把代码格式化为标准格式并输出，`go fmt`命令可以自动格式化指定文件。Go程序员应该养成格式化代码的好习惯。

### 程序结构

>Go语言和其他编程语言一样，一个大的程序是由很多小的基础构件组成的。变量保存值，简单的加法和减法运算被组合成较复杂的表达式。基础类型被聚合为数组或结构体等更复杂的数据结构。然后使用if和for之类的控制语句来组织和控制表达式的执行流程。然后多个语句被组织到一个个函数中，以便代码的隔离和复用。函数以源文件和包的方式被组织。

#### 命名规则

Go语言中所有的命名，都遵循一个简单的命名规则：一个名字必须以一个字母（Unicode字母）或下划线开头，后面可以跟任意数量的字母、数字或下划线。并且Go语言对大小写敏感：hello和Hello是两个不同的名字。在习惯上，Go语言程序员推荐使用 **驼峰式** 命名。

在Go语言中，函数外定义的包级名字（以及函数名本身），如果是首字母大写，则代表它将是导出的，也就是可以被外部的包访问。例如fmt包的Printf函数就是导出的。

#### 声明语句

声明语句定义了程序的各种实体对象以及部分或全部的属性。Go语言主要有四种类型的声明语句：var、const、type和func，分别对应变量、常量、类型和函数实体对象的声明。

每一个Go源文件（.go为后缀名的文件）都以包的声明语句开始，随后是import语句导入依赖的其他包（这点在上文已有说明）。随后是包级别的类型、变量、常量、函数声明语句，包级别的声明语句顺序无关紧要，但是函数内部的名字必须先声明再使用。

下面的例子中声明了两个常量、两个函数和两个变量：

```go
package main

import "fmt"

const freezingF, boilingF = 32.0, 212.0

func main() {
    var ff, bf = freezingF, boilingF
    fmt.Printf("%g°F = %g°C\n", ff, fToC(ff)) // "32°F = 0°C"
    fmt.Printf("%g°F = %g°C\n", bf, fToC(bf)) // "212°F = 100°C"
}

func fToC(f float64) float64 {
    return (f - 32) * 5 / 9
}
```

其中常量freezingF、boilingF是在包级别范围声明的，ff和bf两个变量是在main函数内部声明的。在包级别声明的名字可在整个包对应的每个源文件中访问，而不是仅仅在其声明语句所在的源文件中访问。而局部声明的名字就只能在函数内部被访问。

函数的声明由函数名字、参数列表、可选的返回值列表和包含函数定义的函数体组成。如果函数没有返回值，那么返回值列表是省略的。上例中定义的fToC函数在包级别声明，并且在main函数中被调用了两次。

#### 赋值语句

与大多数语言的赋值语句类似，Go语言使用赋值语句更新变量的值：

```go
x = 1                       // 命名变量的赋值
*p = true                   // 通过指针间接赋值
person.name = "bob"         // 结构体字段赋值
count[x] = count[x] * scale // 数组、slice或map的元素赋值
x += 2                      // 二元算术运算与赋值语句的复合操作
```

数值变量也可以支持`++`递增和`--`递减语句：

```go
v := 1
v++    // 等价方式 v = v + 1；v 变成 2
v--    // 等价方式 v = v - 1；v 变成 1
```

请特别注意，Go语言中自增、自减为语句而不是表达式，因此`x = i++`之类的表达式是非法的。另外`--v`、`++v`也是非法的。

Go语言中还有**元组赋值**的赋值语句，它允许同时更新多个变量的值。在赋值之前，赋值语句右边的所有表达式将会先进行求值，然后再统一更新左边对应变量的值。例如我们可以交换两个变量的值：

```
x, y = y, x
a[i], a[j] = a[j], a[i]
```

或者是计算斐波纳契数列（Fibonacci）的第N个数：

```go
func fib(n int) int {
    x, y := 0, 1
    for i := 0; i < n; i++ {
        x, y = y, x+y
    }
    return x
}
```

元组赋值还有另外一种应用情形：多返回值函数（Go语言中，函数可以返回多个值）。例如打开一个文件：

```go
f, err = os.Open("foo.txt") // 函数返回了两个值
```

`os.Open`函数会返回文件信息和error类型的错误。

在Go语言中，赋值语句两边的变量必须有相同的数据类型。可赋值性的规则对于不同类型有着不同要求，对于本文中讨论过的类型，它的规则是简单的：类型必须完全匹配，nil可以赋值给任何指针或引用类型的变量。

#### 包和文件

Go语言中包（package）的概念与其他语言的库或模块的概念类似，目的都是为了支持模块化、封装、单独编译和代码重用。

一个包的源代码保存在一个或多个以.go为文件后缀名的源文件中，并且这些源文件应该位于同一个目录下，因为包的导入路径与它所在的目录路径是相关的。Go推荐开发者将代码文件以特定的方式组织在**GO工作空间**中，具体内容可参考我的前一篇文章。

包可以选择性的将信息对外部公开而隐藏实现细节。在Go语言中，一个简单的规则是：如果一个名字是大写字母开头的，那么该名字是导出的，可以被外部访问。

现在我们创建`gopl.io/ch2/tempconv`包来进一步说明。这个包将会包含两个文件，它的作用是进行温度转换。

`gopl.io/ch2/tempconv`

*$GOPATH/src/gopl.io/ch2/tempconv/tempconv.go*

```go
// Package tempconv performs Celsius and Fahrenheit conversions.
package tempconv

import "fmt"

type Celsius float64
type Fahrenheit float64

const (
    AbsoluteZeroC Celsius = -273.15
    FreezingC     Celsius = 0
    BoilingC      Celsius = 100
)

func (c Celsius) String() string    { return fmt.Sprintf("%g°C", c) }
func (f Fahrenheit) String() string { return fmt.Sprintf("%g°F", f) }
```

*$GOPATH/src/gopl.io/ch2/tempconv/conv.go*

```go
package tempconv

// CToF converts a Celsius temperature to Fahrenheit.
func CToF(c Celsius) Fahrenheit { return Fahrenheit(c*9/5 + 32) }

// FToC converts a Fahrenheit temperature to Celsius.
func FToC(f Fahrenheit) Celsius { return Celsius((f - 32) * 5 / 9) }
```

每个源文件都是以包的声明语句开始，用来指名包的名字（这里是`package tempconv`）。当其他包导入tempconv包之后，tempconv包的导出成员（大写字母开头）可被其他包以类似`tempconv.CToF`的形式访问。

包级别声明的名字，在同一个包的其他源文件也是可以直接访问的，就好像所有代码都在一个文件一样。要注意的是tempconv.go源文件导入了fmt包，但是conv.go源文件没有，并且在conv.go源文件中无法访问fmt包。

每一个包的源文件中可以包含多个**init初始化函数**：

```go
func init() { /* ... */ }
```

这样的init初始化函数除了不能被调用、引用外，其他行为和普通函数类似。在程序开始执行时，init函数会按照它们声明的顺序被自动调用。例如，你可以在init函数中对变量进行初始化操作。

#### 作用域

声明语句的作用域是指源代码中可以有效使用这个名字的范围。

由花括弧`{}`所包含的一系列语句我们称之为**语法块**，就像函数体或循环体花括弧之间的内容。语法块内部声明的名字是无法被外部语法块访问的。

声明语句对应的词法域决定了作用域范围的大小。以下列出了部分不同的词法域：

- 对于内置类型、函数和常量，比如int、len和true等。它们属于全局作用域，可以在整个程序中直接使用。
- 任何在在函数外部（也就是包级语法域）声明的名字可以在同一个包的任何源文件中访问。
- 对于导入的包，例如导入的fmt包，则是对应源文件级的作用域，因此只能在当前的文件中访问导入的fmt包，同一个包的其他源文件无法访问。
- 函数中的声明的变量，则是局部作用域的，它只能在函数内部访问。

你可以在局部作用域中声明一个外部作用域同名的变量，这是Go语言允许的。当编译器遇到一个名字引用时,它会从最当前的词法域向全局作用域依次查找变量的声明，最先找到的声明视为有效。因此局部作用域的声明可以屏蔽外部作用域的同名声明。

我们来看一个深度嵌套的词法域示例（这个例子仅用作演示，但不是好的编程风格）：

```go
func main() {
    var x = "hello!"
    for i := 0; i < len(x); i++ {
        var x = x[i]
        if x != '!' {
            var x = x + 'A' - 'a'
            fmt.Printf("%c", x) // "HELLO"
        }
    }
}
```

这个例子中声明了三个不同的变量`x`，它们分别位于不同的词法域。

在上面的例子中，for语句循环的初始化时声明了变量`i`，那么`i`是属于哪个作用域的呢？其实，for语句创建了两个词法域：由花括号所包含显式创建的循环体词法域，以及循环初始化时隐式创建的词法域（`i := 0`）。隐式词法域包含了循环体词法域，并且作用于条件测试部分（`i < len(x)`）、循环后的迭代部分（`i++`）。

下面的if-else测试链示例更好的说明了这一点：

```go
if x := f(); x == 0 {
    fmt.Println(x)
} else if y := g(x); x == y {
    fmt.Println(x, y)
} else {
    fmt.Println(x, y)
}
fmt.Println(x, y) // 编译错误: 此处x, y不可见
```

在第二个if的初始化语句中，第一个if所初始化的变量`x`依然是可见的，它位于隐式词法域中。switch语句的每个分支也有类似的词法域规则。

### 说明及参考资料

- 文章中部分示例代码上有一行标记，利用这些标记可从[gopl.io](http://www.gopl.io/)获取源代码。例如：标记`gopl.io/ch1/helloworld`可使用命令`go get gopl.io/ch1/helloworld`获取示例源代码）

- 参考自 [The Go Programming Language 中文版](https://legacy.gitbook.com/book/yar999/gopl-zh/details)