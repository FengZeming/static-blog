在进行移动端web开发时，多机型适配问题是所有开发人员必须考虑的一个问题。早在2015年，手机淘宝团队使用了 flexible 方案解决该问题，原文链接为《[使用Flexible实现手淘H5页面的终端适配](https://www.w3cplus.com/mobile/lib-flexible-for-html5-layout.html)》。随着 `vw` 单位受到越来越多浏览器的支持，他们已经开始探索 `vw` 方案的可行性。事实上，结合现在的前端构建工具，我们已经可以使用 `vw` + `rem` 的新方案来进行移动端适配。

### 基础知识

#### 设备像素 DP(device pixels)

设备像素（物理像素），顾名思义，显示屏是由一个个物理像素点组成的，通过控制每个像素点的颜色，使屏幕显示出不同的图像。
<!--more-->
#### 设备独立像素 DIP(device independent pixel)

设备独立像素，也称为逻辑像素，代表一个可以由程序使用的虚拟像素，然后由相关系统转换为物理像素。也就是说，这是一个抽象的概念。在移动端浏览器中，window 对象有一个 `device​Pixel​Ratio` 属性，MDN官方定义为 **当前显示设备的物理像素分辨率与独立像素分辨率的比值**，也就是 **`devicePixelRatio` = 物理像素 / 独立像素**。

举例来说，Retina屏幕上，`devicePixelRatio` 的值为2，也就是一个独立像素由四个物理像素来显示。为什么说是四个？请看下图：

![非Retina屏幕](/static/img/vwrem-1.jpeg)

非Retina屏幕

![Retina屏幕](/static/img/vwrem-2.jpeg)

Retina屏幕

在Retina屏幕上，一个独立像素点由四个物理像素点来表示，比值为 `devicePixelRatio` 的平方。

#### CSS长度单位：px、rem、vw

在CSS中，有两类长度单位：绝对长度单位和相对长度单位。

`px` 是我们最常使用的绝对长度单位，它代表着CSS像素，也就是设备独立像素（DIP）。

`rem` 是一种相对长度单位，代表对于根元素 `font-size` 的相对大小。

`vw` 是一种相对长度单位，代表着 1% 的视窗宽度。

### 移动端适配的需求

移动端适配最终要达到的目的，就是希望页面在不同分辨率、不同设备像素比的移动设备下显示效果能够一致。这其中包含两个方面：

1. 页面整体布局
2. 字体大小

在整体布局上，我们希望页面可以随着屏幕大小的变化自动缩放，但整体结构不能改变。这里就需要利用到 `vw` 这个单位。因为 `vw` 是视窗1%的宽度，那么只要我们规定了元素的 `vw` 宽度，无论视窗大小如何变化，它也能自动缩放。

但是对字体大小用 `vw` 进行控制可能不会那么理想。在大量文字阅读的场景中，普遍认为 14px～16px 是最佳的文字大小。这是一个绝对单位，不应随着屏幕大小的变化而变化。举例来说，iphone上16px的文字应该与ipad上16px的文字看起来大小一致。倘若我们用 `vw` 来规定文字大小，那么ipad上的文字会变得超大。于是我们可以使用 `rem` 来规定字体大小。`rem` 代表着相对于根元素字体大小的相对大小。如果我们要做字体大小的响应式设计，只需要动态改变根元素的 `font-size` 就可以了。

### 从设计稿的长度单位映射到em单位

我们已经有了实现适配方案的思路，但是遇到了一个问题：设计稿一般都有着一个固定的大小，例如以 iphone6 为基准的 750 * 1334 ，我们怎么样将这个大小映射到 `vw` 呢？

[postcss-px-to-viewport](https://github.com/evrone/postcss-px-to-viewport) 插件帮我们解决了这个问题。使用这个插件，我们可以直接在CSS中用 px 为单位写入设计稿中的长度，postcss 会自动帮我们转化成 `vw` 单位。

### 实际用法

说的再多不如自己动手实践一下。我们将需要下列前端工具来实现这个方案：

- [webpack](https://webpack.js.org/)：打包工具
- [postcss-loader](https://github.com/postcss/postcss-loader)：用于 webpack 的 post-css loader
- [postcss-preset-env](https://github.com/csstools/postcss-preset-env)：允许我们使用现代的CSS语法。
- [postcss-px-to-viewport](https://github.com/evrone/postcss-px-to-viewport)：方案的核心插件
- [postcss-aspect-ratio-mini](https://github.com/yisibl/postcss-aspect-ratio-mini)：用于固定元素的宽高比

#### 实现 px -> vw 的转换

首先我们需要对 [postcss-px-to-viewport](https://github.com/evrone/postcss-px-to-viewport) 插件进行配置：

```javascript
{
  unitToConvert: 'px', // 要被转换的单位
  viewportWidth: 750, // 视窗宽度，这里填入设计稿的宽度
  unitPrecision: 3, // 无法被整除时保留小数点位数
  viewportUnit: 'vw', // 要被转换成的单位
  selectorBlackList: ['.ignore-vw-transform'], // 忽略转换成 vw 单位的选择器
  minPixelValue: 1, // 长度 <= 1px 时将不会被转换
  mediaQuery: false, // 是否允许在媒体查询中转换
}
```

上述代码只包含了部分 [postcss-px-to-viewport](https://github.com/evrone/postcss-px-to-viewport) 可配置项，详细文档请参考官方文档。

根据这个配置，我们定义 100vw = 750px ，插件也是根据这个比例来将 `px` 转换成 `vw` 。举例来说，在一个 750 * 1334 的设计稿中，有一个宽度为 250 的元素。我们这样书写CSS代码：

```css
div {
  width: 250px;
}
```

插件会这样进行转换：**width = 250 / 750 * 100 ~= 33.333%**，最终在页面上属性就变成了这样：

```css
div {
  width: 33.333%vw;
}
```

可以看到开发过程十分简单，不需要我们做任何多于的计算。

#### 固定宽高比元素

在上文的 postcss 插件列表中，还有 [postcss-aspect-ratio-mini](https://github.com/yisibl/postcss-aspect-ratio-mini) 这一插件，它利用 `padding-top` CSS属性来固定元素的宽高比。例如：

```css
.aspect-box {
  position: relative;
}

.aspect-box {
  aspect-ratio: '16:9';
}
```

将会被编译成：

```css
.aspect-box {
  position: relative;
}

.aspect-box:before {
  padding-top: 56.25%;
}
```

需要注意的是，`aspect-ratio` 属性需要使用一个单独的选择器写出，也就是说，不能采用下面的这种写法：

```css
/* postcss-aspect-ratio-mini 插件 错误的写法 */
.aspect-box {
  position: relative;
  aspect-ratio: '16:9';
}
```

这样将会被编译成：

```css
/* position: relative; 属性被忽略了 */
.aspect-box:before {
  padding-top: 56.25%;
}
```

理解了插件的原理，我们就可以方便的写出各种宽高比的元素。我们定义一些公共CSS：

```css
[aspectratio] {
  position: relative;
}

[aspectratio]::before {
  content: '';
  display: block;
  width: 0;
  height: 0;
}
[aspectratio-content] {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
}
```

让具有 `aspectratio` 属性的元素相对定位，具有 `aspectratio-content` 属性的元素绝对定位。使用如下HTML结构：

```html
<div aspectratio class="ast">
  <div aspectratio-content class="ast-content">
    content
  </div>
</div>
```

再指定父元素宽高比：

```css
.ast {
  aspect-ratio: '16:9';
}
```

于是子元素将保持 16:9 宽高比。

#### 响应式字体大小

前文已经简述阅读场景下使用 `vw` 来定义字体大小的问题。我们可以使用 `rem` 来定义字体大小，并使用 Javascript 判断设备信息来动态改变根元素的字体大小，以实现字体的响应式设计。需要注意的是，判断的代码应该在文档加载完毕之前执行，避免改写根元素 `font-size` 引起页面重绘的问题。

在这里不再给出具体的方案，大家可以自己思考一下如何实现。