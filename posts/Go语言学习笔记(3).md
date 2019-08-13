---
title: Go语言学习笔记 - 基础数据类型
date: 2018-05-08 20:33:28
category: Go语言
---

Go语言中基础数据类型包括数字、布尔型和字符串。

### 数字

Go语言的数值类型包括几种不同大小的整形数、浮点数和复数。

#### 整型

Go语言中，整型具备不同的位数，并且分有符号、无符号两类。以下列出了全部的整形类：

- int8、int16、int32、int64四类有符号整形类
- uint8、uint16、uint32、uint64四类无符号整形类
- int、uint两类整形，它们的位数根据CPU平台机器字大小而不同，为32或64bit
- rune类型，为int32类型的别名，通常用于表示一个Unicode码点
- byte类型，为uint8类型的别名，一般用于强调数值是一个原始的数据而不是一个小的整数
- uintptr，没有指定具体的bit大小但是足以容纳指针

一个N位的有符号数的有效范围为 −2^(N−1) ~ 2^(N-1)−1 ​​，而N位无符号数的有效范围为 0 ~ 2^(N-1) 。
<!--more-->

#### 浮点数

Go语言提供了两种精度的浮点数，float32和float64。它们的算术规范由IEEE754浮点数国际标准定义，该浮点数规范被所有现代的CPU支持。

这些浮点数类型的取值范围可以从很微小到很巨大。浮点数的范围极限值可以在math包找到。常量math.MaxFloat32表示float32能表示的最大数值，大约是 3.4e38 ；对应的math.MaxFloat64常量大约是 1.8e308。它们分别能表示的最小值近似为 1.4e-45 和 4.9e-324 。

一个float32类型的浮点数可以提供大约6个十进制数的精度，而float64则可以提供约15个十进制数的精度；通常应该优先使用float64类型，因为float32类型的累计计算误差很容易扩散，并且float32能精确表示的正整数并不是很大。（float32的有效bit位只有23个，其它的bit位用于指数和符号；当整数大于23bit能表达的范围时，float32的表示将出现误差）

```go
var f float32 = 16777216 // 2^24
fmt.Println(f == f+1)    // "true"!
```

#### 复数

Go语言提供了两种精度的复数类型：complex64和complex128，分别对应float32和float64两种浮点数精度。内置的`complex`函数用于构建复数，内建的`real`和`imag`函数分别返回复数的实部和虚部：

```go
var x complex128 = complex(1, 2) // 1+2i
var y complex128 = complex(3, 4) // 3+4i
fmt.Println(x*y)                 // "(-5+10i)"
fmt.Println(real(x*y))           // "-5"
fmt.Println(imag(x*y))           // "10"
```

如果一个浮点数面值或一个十进制整数面值后面跟着一个i，例如3.141592i或2i，它将构成一个复数的虚部，复数的实部是0：

```go
fmt.Println(1i * 1i) // "(-1+0i)", i^2 = -1
```

我们还可以用自然的方式书写复数，就像1+2i或2i+1。上面x和y的声明语句还可以简化：

```go
x := 1 + 2i
y := 3 + 4i
```

复数也可以用==和!=进行相等比较。只有两个复数的实部和虚部都相等的时候它们才是相等的（浮点数的相等比较是危险的，需要特别小心处理精度问题）。

math/cmplx包提供了复数处理的许多函数，例如求复数的平方根函数和求幂函数。

```go
fmt.Println(cmplx.Sqrt(-1)) // "(0+1i)"
```

### 布尔型

一个布尔类型的值只有两种：`true`和`false`。

布尔值可以和`&&`（与）和`||`（或）操作符结合，并且可能会有短路行为：如果运算符左边值已经可以确定整个布尔表达式的值，那么运算符右边的值将不在被求值，因此下面的表达式总是安全的：

```go
s != "" && s[0] == 'x'
```

布尔值并不会隐式转换为数字值0或1，反之亦然，因此无法将布尔值与0这样的数值进行比较。同理，布尔值也无法与空字符串进行比较。

### 字符串

一个字符串是一个不可改变的字节序列。内置的`len`函数可以返回一个字符串中的字节数目（请注意，这里是字节数目，而不是`rune`字符数目），索引操作`s[i]`返回第i个字节的字节值，i必须满足0 ≤ i< len(s)条件约束，否则将会导致 panic: index out of range

```go
s := "hello, world"
fmt.Println(len(s))     // "12"
fmt.Println(s[0], s[7]) // "104 119" ('h' and 'w')
c := s[len(s)] // panic: index out of range
```

字符串的值是不可变的：一个字符串包含的字节序列永远不会被改变，下列操作是非法的：

```go
s[0] = 'H' // compile error: cannot assign to s[0]
```

字符串值可用字符串面值的方式书写，使用双引号 "" 或反引号 `` 表示。两者的区别在于：反引号中的转义符不会被转义。

```go
fmt.Println("hello, world\nhello")
// hello, world
// hello
fmt.Println(`hello, world\nhello`)
// hello, world\nhello
```

#### 字符串编码

**Unicode**

Unicode收集了这个世界上所有的符号系统，它可以用来表示任何字符，对每个符号都分配了唯一的Unicode码点，Unicode码点对应Go语言中的rune整数类型（rune是int32等价类型，占32位。rune的中文意思为符文）。

Unicodeb编码也叫UTF-32或UCS-4，每个Unicode码点都使用同样的大小32bit来表示。这种方式比较简单统一，但是它会浪费很多存储空间：本来每个ASCII字符只需要8bit或1字节就能表示，现在却需要使用四倍的空间。

**UTF-8**

UTF8是一个将Unicode码点编码为字节序列的变长编码。UTF8编码使用1到4个字节来表示每个Unicode码点，ASCII部分字符只使用1个字节，常用字符部分使用2或3个字节表示。每个符号编码后第一个字节的高端bit位用于表示总共有多少编码个字节。如果第一个字节的高端bit为0，则表示对应7bit的ASCII字符，ASCII字符每个字符依然是一个字节，和传统的ASCII编码兼容。如果第一个字节的高端bit是110，则说明需要2个字节；后续的每个高端bit都以10开头。更大的Unicode码点也是采用类似的策略处理。

```
0xxxxxxx                             runes 0-127    (ASCII)
110xxxxx 10xxxxxx                    128-2047       (values <128 unused)
1110xxxx 10xxxxxx 10xxxxxx           2048-65535     (values <2048 unused)
11110xxx 10xxxxxx 10xxxxxx 10xxxxxx  65536-0x10ffff (other values unused)
```

UTF8编码比较紧凑，完全兼容ASCII码，并且可以自动同步：它可以通过向前回朔最多2个字节就能确定当前字符编码的开始字节的位置。它也是一个前缀编码，所以当从左向右解码时不会有任何歧义也并不需要向前查看（像GBK之类的编码，如果不知道起点位置则可能会出现歧义）。

Go语言字符串面值中的Unicode转义字符让我们可以通过Unicode码点输入特殊的字符。有两种形式：\uhhhh对应16bit的码点值，\Uhhhhhhhh对应32bit的码点值，其中h是一个十六进制数字；一般很少需要使用32bit的形式。每一个对应码点的UTF8编码。例如：下面的字母串面值都表示相同的值：

```
"世界"
"\xe4\xb8\x96\xe7\x95\x8c"
"\u4e16\u754c"
"\U00004e16\U0000754c"
```

前文提到过，在Go语言中，len(s)代表了一个字符串的字节长度而不是字符长度。考虑下面这个例子，它混合了中西字符，包含13字节，以UTF-8编码，但是只对应9个Unicode字符：

```go
import "unicode/utf8"

s := "Hello, 世界"
fmt.Println(len(s))                    // "13"
fmt.Println(utf8.RuneCountInString(s)) // "9"
```

Go语言的range循环在处理字符串的时候，会自动隐式解码UTF8字符串。下图展示了字符串在内存中的表现形式，以及range循环的解码过程：

![range循环解码UTF-8编码字符串](/static/img/golang3-1.png)

注意到，上例中每个中文字符占用三个字节，对应一个Unicode码点。

UTF8字符串作为交换格式是非常方便的，但是在程序内部采用rune序列可能更方便，因为rune大小一致，支持数组索引和方便切割。

string接受到[]rune的类型转换，可以将一个UTF8编码的字符串解码为Unicode字符序列：

```go
// "program" in Japanese katakana
s := "プログラム"
fmt.Printf("% x\n", s) // "e3 83 97 e3 83 ad e3 82 b0 e3 83 a9 e3 83 a0"
r := []rune(s)
fmt.Printf("%x\n", r)  // "[30d7 30ed 30b0 30e9 30e0]"
```

### 常量

常量表达式的值在编译期计算，而不是在运行期。每种常量的潜在类型都是基础类型：boolean、string或数字。

一个常量的声明语句定义了常量的名字，和变量的声明语法类似，常量的值不可修改，这样可以防止在运行期被意外或恶意的修改。

```go
const pi = 3.14159 // approximately; math.Pi is a better approximation

const (
    e  = 2.71828182845904523536028747135266249775724709369995957496696763
    pi = 3.14159265358979323846264338327950288419716939937510582097494459
)
```

#### 无类型常量

在Go语言中，许多常量并没有一个明确的基础类型。编译器为这些没有明确的基础类型的数字常量提供比基础类型更高精度的算术运算；你可以认为至少有256bit的运算精度。这里有六种未明确类型的常量类型：

- 无类型的布尔型
- 无类型的整数
- 无类型的字符
- 无类型的浮点数
- 无类型的复数
- 无类型的字符串

对于常量面值，不同的写法可能会对应不同的类型。例如0、0.0、0i和'\u0000'虽然有着相同的常量值，但是它们分别对应无类型的整数、无类型的浮点数、无类型的复数和无类型的字符等不同的常量类型。

当一个无类型的常量被赋值给一个变量的时候，无类型的常量将会被隐式转换为对应的类型（如果转换合法的话）：

```go
var f float64 = 3 + 0i // untyped complex -> float64
f = 2                  // untyped integer -> float64
f = 1e123              // untyped floating-point -> float64
f = 'a'                // untyped rune -> float64
```

无论是隐式或显式转换，将一种类型转换为另一种类型都要求目标可以表示原始值。对于浮点数和复数，可能会有舍入处理：

```go
const (
    deadbeef = 0xdeadbeef // untyped int with value 3735928559
    a = uint32(deadbeef)  // uint32 with value 3735928559
    b = float32(deadbeef) // float32 with value 3735928576 (rounded up)
    c = float64(deadbeef) // float64 with value 3735928559 (exact)
    d = int32(deadbeef)   // compile error: constant overflows int32
    e = float64(1e309)    // compile error: constant overflows float64
    f = uint(-1)          // compile error: constant underflows uint
)
```

对于一个没有显式类型的变量声明语法（包括短变量声明语法），无类型的常量会被隐式转为默认的变量类型，就像下面的例子：

```go
i := 0      // untyped integer;        implicit int(0)
r := '\000' // untyped rune;           implicit rune('\000')
f := 0.0    // untyped floating-point; implicit float64(0.0)
c := 0i     // untyped complex;        implicit complex128(0i)
```

如果要给变量一个不同的类型，我们必须显式地将无类型的常量转化为所需的类型，或给声明的变量指定明确的类型，像下面例子这样：

```go
var i = int8(0)
var i int8 = 0
```

### 说明及参考资料

- 文章中部分示例代码上有一行标记，利用这些标记可从[gopl.io](http://www.gopl.io/)获取源代码。例如：标记`gopl.io/ch1/helloworld`可使用命令`go get gopl.io/ch1/helloworld`获取示例源代码）

- 参考自 [The Go Programming Language 中文版](https://legacy.gitbook.com/book/yar999/gopl-zh/details)