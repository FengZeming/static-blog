*翻译自官方文档 [How to Write Go Code ](https://golang.org/doc/code.html)*

### 正确组织你的Go代码

利用 Go 官方的 go tool 可以十分便捷地与开源代码进行协同工作，它让你能获取、编译、安装Go包与Go命令。想要使用好 go tool，需要以一种特定的方式组织你的代码。
<!--more-->
#### 要点

- 一般来说，Go开发者会将全部的Go代码保存在一个**单独的工作空间**中
- 一个工作空间里可以包含多种、多个版本控制**仓库**（例如Git）
- 每一个仓库包含一个或多个**包**
- 每一个包就是一个单独的目录，包含有一个或多个Go源码文件
- 包在工作空间中所存放的路径就决定了它的导入路径

在这里需要注意一点：此处所说的工作空间区别于以往的工作空间。一般来说，我们平常所说的工作空间对应于一个单独的项目，而这里代表Go的工作空间。

### 工作空间

Go代码必须放在工作空间内。它其实就是一个目录，其中包含三个子目录：

- src 目录：包含Go的源文件，它们被组织成包（每个目录都对应一个包）
- pkg 目录：包含包对象，由Go源码编译而来
- bin 目录：包含可执行命令，由Go源码编译而来

go tool 编译 src 下的文件，并将编译好的二进制文件分别放入 pkg 或者 bin 文件夹中。src 目录可以包含多个版本控制仓库(比如 Git 或 Mercurial)，以此来跟踪一个或多个源码包的开发。

我们通过一个工作空间的示例来说明：

```
bin/
    hello                          # 可执行命令
    outyet                         # 可执行命令
pkg/
    linux_amd64/
        github.com/golang/example/
            stringutil.a           # 包对象
src/
    github.com/golang/example/
        .git/                      # Git仓库元数据
        hello/
            hello.go               # 命令源码
        outyet/
            main.go                # 命令源码
            main_test.go           # 测试源码
        stringutil/
            reverse.go             # 包源码
            reverse_test.go        # 测试源码
    golang.org/x/image/
        .git/                      # Git仓库元数据
        bmp/
            reader.go              # 包源码
            writer.go              # 包源码
```

上面的树展示了一个包含两个Git仓库的工作空间( `example` 与 `image` )。`example` 仓库包含两个命令( `hello` 与 `outyet` )以及一个库( `stringutil` )。`image` 仓库包含 `bmp` 包。

### GOPATH 环境变量

`GOPATH` 环境变量指向你的 **Go工作空间** 的位置。

Go将 `$HOME/go` 作为默认的Go工作空间。如果想自定义工作空间，需要自己创建一个文件夹，并且在环境变量中将 `GOPATH` 设置为该文件夹的路径。**需要注意的是，`GOPATH` 不能与Go的安装路径相同**。

使用命令 `go env GOPATH` 可以查看当前的 `GOPATH` 环境变量。

另外，一般会将工作空间的 *bin* 目录加入到环境变量 `PATH` 中。

### 导入路径

Go中的包都需要有唯一的导入路径来进行区分。在Go中，每个包的导入路径由**它在工作空间中的路径**或**远程仓库的位置**决定。

Go标准库中的包只要使用短路径即可导入，比如 "fmt" 、"net/http" 。

对于自己的包，必须选择一个基本路径以防止和标准库或第三方库发生冲突。一般建议以代码仓库的根目录作为包的基本路径。假如你在 GitHub 有个账户 `github.com/user`，那么选择 `github.com/user` 作为基本路径是一个不错的选择。

现在请在工作空间中创建文件夹 `$GOPATH/src/github.com/user` 作为基本路径。

```bash
$ mkdir $GOPATH/src/github.com/user/hello
```

### 第一个Go程序

完成上面的步骤之后，我们用Go来写一个 Hello World 程序。

首先在基本路径下创建文件夹 `hello` 作为包的目录。

随后在该文件夹中创建 `hello.go` 文件，内容如下：

```go
package main

import "fmt"

func main() {
  fmt.Printf("Hello, world.\n")
}
```

使用 go tool 来编译和安装上面的 hello 程序。

```bash
$ go install github.com/user/hello
```

**注意** 你可以在任何路径下运行该命令，go tool 会根据 `GOPATH` 环境变量从工作空间查找 `github.com/user/hello` 包的源码。

另外，在包的当前路径下可以忽略包路径参数执行命令。

```bash
$ cd $GOPATH/src/github.com/user/hello
$ go install
```

该命令编译并产生此命令的二进制可执行文件。

你会发现在工作空间的 *bin* 路径下多出了 hello 的二进制文件（Windows下为 hello.exe）。

现在可以执行该 `hello` 程序（输入hello的完整路径）：

```bash
$ $GOPATH/bin/hello
Hello, world.
```

如果将 `$GOPATH/bin` 加入到了 `PATH` 中的话, 也可以直接执行 `hello` 命令：

```bash
$ hello
Hello, world.
```

接下来是可选的一步：将源码包加入到版本控制系统。

我们需要初始化仓库、添加并提交文件。

```bash
$ cd $GOPATH/src/github.com/user/hello
$ git init
Initialized empty Git repository in /home/user/work/src/github.com/user/hello/.git/
$ git add hello.go
$ git commit -m "initial commit"
[master (root-commit) 0b4507d] initial commit
 1 file changed, 1 insertion(+)
  create mode 100644 hello.go
```

接下来你还可以将代码推送到远程仓库。

### 第一个Go库

让我们来写一个库，并将其用于之前的hello程序。

首先选择好包路径，并创建相应的文件夹（我们使用 `github.com/user/stringutil` ）：

```bash
$ mkdir $GOPATH/src/github.com/user/stringutil
```

随后在文件夹下创建文件 `reverse.go` ，输入以下内容：

```go
// Package stringutil contains utility functions for working with strings.
package stringutil

// Reverse returns its argument string reversed rune-wise left to right.
func Reverse(s string) string {
  r := []rune(s)
  for i, j := 0, len(r)-1; i < len(r)/2; i, j = i+1, j-1 {
    r[i], r[j] = r[j], r[i]
  }
  return string(r)
}
```

现在使用 `go build` 命令测试包能否正确编译：

```bash
$ go build github.com/user/stringutil
```

在包目录下可以忽略路径参数：

```bash
$ go build
```

该命令不会产生输入文件。想要生成输出文件，需要使用 `go install` 命令，它会在 *pkg* 文件夹下生成包对象。

在 stringutil 包编译成功后，修改我们的 hello.go 文件：

```go
package main

import (
  "fmt"
  "github.com/user/stringutil"
)

func main() {
  fmt.Printf(stringutil.Reverse("!oG ,olleH"))
}
```

随后重新安装 hello 程序：

```bash
$ go install github.com/user/hello
```

执行它：

```bash
$ hello
Hello, Go!
```

经过上述的所有步骤后，你的工作空间应该看起来像这样了：

```
bin/
    hello                 # 可执行命令
pkg/
    linux_amd64/          # 反映了操作系统和架构
        github.com/user/
            stringutil.a  # 包对象
src/
    github.com/user/
        hello/
            hello.go      # 命令源码
        stringutil/
            reverse.go    # 包源码
```

注意到，`go install` 在目录 `pkg/linux_amd64` 下生成了 `stringutil.a` 文件，并且文件的相对路径与 `src` 下的相对路径一致。以后 go tool 就可以直接从 `stringutil.a` 找到这个包而避免了重复编译。

`linux_amd64` 表示了当前使用的系统与架构，该目录的用来区分交叉编译出的其他平台的包对象。

另外，Go编译出的二进制文件都是静态链接的，它们的执行不依赖与其导入的包。

### 包的名称

go代码的第一行必须是：

```go
package name
```

这里的 `name` 就是包的默认导入名称（同个包中的所有文件必须使用相同的 name）。

Go约定，包的名称就是导入路径的最后一部分：以 "crypto/rot13" 导入的包名称必须为 rot13 。

**需要编译为可执行文件的包，包名必须为 `main`**

包的名称不一定要是唯一的，只要包的导入路径是唯一的即可。举例来说：除了上文的 "crypto/rot13" 包，你也可以创建 "another-crypto/rot13" 包。

想要了解更多关于包命名的约定，可以参考 [Effective Go](https://golang.org/doc/effective_go.html#names) 。

### 测试

Go自带一个轻量级测试框架，由 `go test` 命令和 `testing` 包组成。

测试文件的名称应该以 `_test.go` 结尾，其中包含名称类似于 `TestXXX` 、签名类似于 `func (t *testing.T)` 的函数。测试框架会执行每一个这样的函数，并且在函数调用了 `t.Error` 或 `t.Fail` 这样的错误函数时认为测试失败。

现在我们为上面的 `stringutil` 包添加测试文件。

创建 `$GOPATH/src/github.com/user/stringutil/reverse_test.go` 文件，并添加如下代码：

```go
package stringutil

import "testing"

func TestReverse(t *testing.T) {
  cases := []struct {
    in, want string
  }{
    {"Hello, world", "dlrow ,olleH"},
    {"Hello, 世界", "界世 ,olleH"},
    {"", ""},
  }
  for _, c := range cases {
    got := Reverse(c.in)
    if got != c.want {
      t.Errorf("Reverse(%q) == %q, want %q", c.in, got, c.want)
    }
  }
}
```

随后使用 `go test` 执行测试：

```bash
$ go test github.com/user/stringutil
ok    github.com/user/stringutil 0.165s
```

或者在stringutil的包目录下直接运行：

```bash
$ go test
ok    github.com/user/stringutil 0.165s
```

想要了解更多细节，可以执行命令 `go help test` 或参考 [testing package documentation](https://golang.org/pkg/testing/) 。

#### 远程包

Go 的 `import path` 描述了如何使用 Git 等版本控制系统来获取包的源码。go tool 可以利用这个特性来自动获取远程仓库里的代码。

举例来说，本文的例子在 GitHub [github.com/golang/example](https://github.com/golang/example) 上也保存了一份代码。如果你将远程包的地址写在包的导入路径中，`go get` 命令会自动获取、编译并安装该远程包。

为了进一步进行理解，我们执行下面的命令：

```bash
$ go get github.com/golang/example/hello
$ $GOPATH/bin/hello
Hello, Go examples!
```

现在查看你的工作空间，它的文件夹结构应该大致如下：

```
bin/
    hello                           # 可执行命令
pkg/
    linux_amd64/
        github.com/golang/example/
            stringutil.a            # 包对象
        github.com/user/
            stringutil.a            # 包对象
src/
    github.com/golang/example/
	.git/
        hello/
            hello.go                # 命令源码
        stringutil/
            reverse.go              # 包源码
            reverse_test.go         # 测试源码
    github.com/user/
        hello/
            hello.go                # 命令源码
        stringutil/
            reverse.go              # 包源码
            reverse_test.go         # 测试源码
```

注意到 `github.com/golang/example/stringutil` 包同时被下载到了工作空间中。这里可能有点奇怪，我们用 `go get` 只获取 `hello` 包，为什么 `stringutil` 包也在这里？

我们看一下文件 `github.com/golang/example/hello/hello.go` 中导入的包：

```
import (
  "fmt"

  "github.com/golang/example/stringutil"
)
```

Go首先会在我们的工作空间中寻找 `github.com/golang/example/stringutil` 包。但是我们并没有这个包，因此 `go get` 命令会尝试在 GitHub 的远程仓库获取、编译、安装这个包。（如果包在本地已经存在，`go get` 会跳过获取这一步，执行 `go install` 相同的行为）

这样的特性使得Go的包很容易的被他人所使用。

[Go Wiki](https://golang.org/wiki/Projects) 和 [godoc.org](https://godoc.org) 上列出了很多的第三方Go项目。

想要了解更多用 go tool 使用远程仓库的信息，请参考 [go help import path](https://golang.org/cmd/go/#hdr-Remote_import_paths) 。