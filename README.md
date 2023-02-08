关于workspace协议，根据官网的介绍，我们可以了解到：
1. 默认情况下，如果dependencies中的依赖包版本存在于workspace中，那么会从workspace中关联包，如果依赖包的版本超出workspace的版本，那么会从registry去下载安装。

一种方式是直接使用workspace协议，比如安装tools包，可以使用"tools": "workspace:*"这种形式，在发布包的时候会直接将workspace直接替换成版本号 如： "tools": "workspace:^1.0.1" ==> "tools": "^1.0.1"

注： 使用wrokspace:的相对路径，会替换为link:,最终发布包的时候不会被换成正式版本号。
2. 

