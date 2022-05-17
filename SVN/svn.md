# SVN教程

## 1、SVN常见操作

1. **发布项目（share project）**
   * 项目组长将本机项目第一次发布到中央仓库中 
2. **下载项目（检出项目check out）**
   * 组员将中央仓库中的项目第一次下载到本地
3. **提交（commit）**
   * 将本地修改的内容同步到服务器中（本地 => 服务器）
   * ==编写完一个小功能之后、每天下班前一定要**及时提交**==
4. **更新（update）**
   * 将服务器中最新的代码同步到本地（服务器=>本地）
   * ==编写功能之前，每天上班前一定要**及时更新**==



## 2、SVN安装

### 2.1 svn 服务端

1. 下载地址：[visualsvn](https://www.visualsvn.com/downloads/)

![image-20211010044539938](https://gitee.com/testlyx/cloudimage/raw/master/img/image-20211010044539938.png) 

2. 双击下载的安装程序

   ![image-20211010045215256](https://gitee.com/testlyx/cloudimage/raw/master/img/image-20211010045215256.png) 



3. 如图步骤安装

   ![image-20211010045301067](https://gitee.com/testlyx/cloudimage/raw/master/img/image-20211010045301067.png) 

   ![image-20211010045425842](https://gitee.com/testlyx/cloudimage/raw/master/img/image-20211010045425842.png) 

   ![image-20211010045547568](https://gitee.com/testlyx/cloudimage/raw/master/img/image-20211010045547568.png) 

   ![image-20211010050035086](https://gitee.com/testlyx/cloudimage/raw/master/img/image-20211010050035086.png) 

   ![image-20211010050121321](https://gitee.com/testlyx/cloudimage/raw/master/img/image-20211010050121321.png) 

   ![image-20211010050142541](https://gitee.com/testlyx/cloudimage/raw/master/img/image-20211010050142541.png) 

   ![image-20211010050209146](https://gitee.com/testlyx/cloudimage/raw/master/img/image-20211010050209146.png) 
   
   ![image-20211010051439380](https://gitee.com/testlyx/cloudimage/raw/master/img/image-20211010051439380.png) 
   
   ![image-20211010051505235](https://gitee.com/testlyx/cloudimage/raw/master/img/image-20211010051505235.png) 



### 2.2 svn 客户端（小乌龟）

1. 下载地址：[TortoiseSVN](https://tortoisesvn.net/downloads.zh.html)

![image-20211010052007387](https://gitee.com/testlyx/cloudimage/raw/master/img/image-20211010052007387.png) 

2. 双击安装程序

   ![image-20211010052115936](https://gitee.com/testlyx/cloudimage/raw/master/img/image-20211010052115936.png) 



3. 安装步骤如图所示

   ![image-20211010052320726](https://gitee.com/testlyx/cloudimage/raw/master/img/image-20211010052320726.png) 

   ![image-20211010052337305](https://gitee.com/testlyx/cloudimage/raw/master/img/image-20211010052337305.png) 

   ![image-20211010052628240](https://gitee.com/testlyx/cloudimage/raw/master/img/image-20211010052628240.png) 

   ![image-20211010052711448](https://gitee.com/testlyx/cloudimage/raw/master/img/image-20211010052711448.png) 



## 3、配置

> 说明：服务器端需要提供IP，端口，账号，密码供客户端使用。



### 3.1 配置ip和端口

![image-20211010083335944](https://gitee.com/testlyx/cloudimage/raw/master/img/image-20211010083335944.png)

![image-20211010083438210](https://gitee.com/testlyx/cloudimage/raw/master/img/image-20211010083438210.png)

> Server name的值可以设置为：
>
> 1. 127.0.0.1（只能本地自己访问）
> 2. 电脑用户名（只能本地自己访问）
> 3. 电脑ip（能够通过ip访问的用户均可）
>
> Server Port使用默认值即可



### 3.2 新建用户

![image-20211010084546305](https://gitee.com/testlyx/cloudimage/raw/master/img/image-20211010084546305.png)

![image-20211010084629538](https://gitee.com/testlyx/cloudimage/raw/master/img/image-20211010084629538.png)



### 3.3 新建分组

![image-20211010085928709](https://gitee.com/testlyx/cloudimage/raw/master/img/image-20211010085928709.png)

![image-20211010090327159](https://gitee.com/testlyx/cloudimage/raw/master/img/image-20211010090327159.png)



## 4、SVN的使用

### 4.1 新建版本库

1. 选择Repositories右键，选择Create New Repostiory

   ![image-20211010195523266](https://gitee.com/testlyx/cloudimage/raw/master/img/image-20211010195523266.png) 



2. 使用默认设置，选择下一步

   ![image-20211010195807643](https://gitee.com/testlyx/cloudimage/raw/master/img/image-20211010195807643.png) 



3. 设置仓库的名字

   ![image-20211010195910248](https://gitee.com/testlyx/cloudimage/raw/master/img/image-20211010195910248.png) 



4. 创建仓库

   ![image-20211010200042792](https://gitee.com/testlyx/cloudimage/raw/master/img/image-20211010200042792.png) 



5. 设置用户访问权限

   ![image-20211010200640024](https://gitee.com/testlyx/cloudimage/raw/master/img/image-20211010200640024.png) 



6. 创建成功

   ![image-20211010200731581](https://gitee.com/testlyx/cloudimage/raw/master/img/image-20211010200731581.png) 

   ![image-20211010201032511](https://gitee.com/testlyx/cloudimage/raw/master/img/image-20211010201032511.png)  



### 4.2 导入项目到svn（import）

1. 复制仓库地址

   ![image-20211010201441723](https://gitee.com/testlyx/cloudimage/raw/master/img/image-20211010201441723.png) 



2. 找到自己的项目右键，选择TorstoiseSVN，选择导入

   ![image-20211010201547944](https://gitee.com/testlyx/cloudimage/raw/master/img/image-20211010201547944.png) 



3. 选择上传的位置

   ![image-20211010201944299](https://gitee.com/testlyx/cloudimage/raw/master/img/image-20211010201944299.png) 

   ![image-20211010202053751](https://gitee.com/testlyx/cloudimage/raw/master/img/image-20211010202053751.png)

   ![image-20211010202249570](https://gitee.com/testlyx/cloudimage/raw/master/img/image-20211010202249570.png) 



4. 项目导入

   ![image-20211010202321603](https://gitee.com/testlyx/cloudimage/raw/master/img/image-20211010202321603.png) 



5. 查看是否导入成

   ![image-20211010202417884](https://gitee.com/testlyx/cloudimage/raw/master/img/image-20211010202417884.png) 

   ![image-20211010202459809](https://gitee.com/testlyx/cloudimage/raw/master/img/image-20211010202459809.png) 





### 4.3 检索项目（check out）

1. 复制远程仓库中项目的地址

   ![image-20211010202757712](https://gitee.com/testlyx/cloudimage/raw/master/img/image-20211010202757712.png) 



2. 在本地任意位置检出

   ![image-20211010202840009](https://gitee.com/testlyx/cloudimage/raw/master/img/image-20211010202840009.png) 



3. 导出项目到本地

   ![image-20211010203023277](https://gitee.com/testlyx/cloudimage/raw/master/img/image-20211010203023277.png) 

    

4. 检出成功

   ![image-20211010203118864](https://gitee.com/testlyx/cloudimage/raw/master/img/image-20211010203118864.png) 



### 4.4 提交代码 （commit）

1. 选择修改好的文件邮件，选择TortoiseSVN，选择加入

   ![image-20211010203559570](https://gitee.com/testlyx/cloudimage/raw/master/img/image-20211010203559570.png)  



2. 提交项目

   ![image-20211010203733323](https://gitee.com/testlyx/cloudimage/raw/master/img/image-20211010203733323.png) 

   ![image-20211010203850084](https://gitee.com/testlyx/cloudimage/raw/master/img/image-20211010203850084.png)



3. 查看是否更新成功

   ![image-20211010203938418](https://gitee.com/testlyx/cloudimage/raw/master/img/image-20211010203938418.png) 



### 4.5 更新代码（update）

1. 在项目任意位置邮件，更新

   ![image-20211010204220603](https://gitee.com/testlyx/cloudimage/raw/master/img/image-20211010204220603.png) 



2. 查看更新信息

   ![image-20211010204259449](https://gitee.com/testlyx/cloudimage/raw/master/img/image-20211010204259449.png) 







### 4.6 版本冲突问题

#### 4.6.1 版本冲突的原因

有A、b两位用户同时检索到项目的版本1，然后B先修改了文件并且提交了，然后A提交文件时会发现修改的文件与B的文件有冲突的地方，系统不知道该如何将A提交的文件更新到仓库的项目中。



#### 4.6.2 版本冲突的现象

冲突发生时, subversion会在当前工作目录中保存所有的目标文件版本[上次更新版本、当前获取的版本(即别人提交的版本)、自己更新的版本、目标文件]。

假设文件名是 kingtuns.txt

对应的文件名分别是

* kingtuns.txt.r101 上次更新版本
* kingtuns.txt.r102 当前获取的版本
* kingtuns.txt.mine 自己更新的版本
* kingtuns.txt 目标文件

同时在目标文件中标记来自不同用户的更改。



#### 4.6.3 场景

1. A用户检出版本5的项目

   ![image-20211010205307848](https://gitee.com/testlyx/cloudimage/raw/master/img/image-20211010205307848.png) 



2. B用户检出版本5的项目

   ![image-20211010205346451](https://gitee.com/testlyx/cloudimage/raw/master/img/image-20211010205346451.png) 



3. A用户修改hello.txt文件并提交

   ![image-20211010205446944](https://gitee.com/testlyx/cloudimage/raw/master/img/image-20211010205446944.png) 

   ![image-20211010205543414](https://gitee.com/testlyx/cloudimage/raw/master/img/image-20211010205543414.png) 

   此时仓库中的版本已经变为6

   ![image-20211010205627340](https://gitee.com/testlyx/cloudimage/raw/master/img/image-20211010205627340.png) 



4. B用户修改项目并提交

   ![image-20211010205728182](https://gitee.com/testlyx/cloudimage/raw/master/img/image-20211010205728182.png) 

   B用户将文件提交至服务器时,提示版本过期:首先应该从版本库更新版本,然后去解决冲突,冲突解决后要执行 svn resolved(解决),然后在签入到版本库。在冲突解决之后,需要使用svn resolved(解决)来告诉subversion冲突解决,这样才能提交更新

   ![image-20211010205922000](https://gitee.com/testlyx/cloudimage/raw/master/img/image-20211010205922000.png) 

   ![image-20211010210431876](https://gitee.com/testlyx/cloudimage/raw/master/img/image-20211010210431876.png)  

   ![image-20211010210500079](https://gitee.com/testlyx/cloudimage/raw/master/img/image-20211010210500079.png)  

   ![image-20211010211123538](https://gitee.com/testlyx/cloudimage/raw/master/img/image-20211010211123538.png)  

   ![image-20211010211240612](https://gitee.com/testlyx/cloudimage/raw/master/img/image-20211010211240612.png)  

    

   



#### 4.6.4 解决冲突的三种方法

1. 放弃自己的更新,使用 svn revert(回滚),然后提交。在这种方式下不需要使用svn resolved(解决)
2. 放弃自己的更新,使用别人的更新。使用最新获取的版本覆盖目标文件,执行 resolved filename并提交(选择文件一右键一解决)
3. 手动解决:冲突发生时,通过和其他用户沟通之后,手动更新目标文件。然后执行 resolved filename来解除冲突,最后提交。



#### 4.6.5 解决冲突

1. 在冲突的文件上右键，选择TortoiseSVN，编辑冲突

   ![image-20211010214850857](https://gitee.com/testlyx/cloudimage/raw/master/img/image-20211010214850857.png)  



2. 手动处理冲突文件

   ![image-20211010215158351](https://gitee.com/testlyx/cloudimage/raw/master/img/image-20211010215158351.png) 

   ![image-20211010215250026](https://gitee.com/testlyx/cloudimage/raw/master/img/image-20211010215250026.png) 



3. 提交文件

   ![image-20211010215437367](https://gitee.com/testlyx/cloudimage/raw/master/img/image-20211010215437367.png) 





#### 4.6.6 如何降低冲突解决的复杂度

1. 当文档编辑完成后,尽快提交,频繁的提交/更新可以降低在冲突发生的概率,以及发生时解决冲突的复杂度
2. 在提交时,写上明确的 message,方便以后查找用户更新的原因,毕竟随着时间的推移,对当初更新的原因有可能会遗忘
3. 养成良好的使用习惯**每天早上打开后,首先要从版本库获取最新版本。每天下班前必须将已经编辑过的文档都提交到版本库**



## 5. IDEA中使用SVN

### 5.1 配置SVN环境

1. 进入idea，选择File => New projects Setup => setting for New Project...

   ![image-20211010220218266](https://gitee.com/testlyx/cloudimage/raw/master/img/image-20211010220218266.png) 



2. 配置svn

   ![image-20211010221154588](https://gitee.com/testlyx/cloudimage/raw/master/img/image-20211010221154588.png) 







### 5.2 检索项目

1. 选择VCS，选择Get from Version Control...

   ![image-20211010223147441](https://gitee.com/testlyx/cloudimage/raw/master/img/image-20211010223147441.png) 



2. Version control选择Subversion，添加仓库中连接的地址

   ![image-20211010223318624](https://gitee.com/testlyx/cloudimage/raw/master/img/image-20211010223318624.png) 



3. 选择刚刚添加的连接，选择CHECK OUT

   ![image-20211010223442549](https://gitee.com/testlyx/cloudimage/raw/master/img/image-20211010223442549.png) 



4. 设置项目根路径

   ![image-20211010223532743](https://gitee.com/testlyx/cloudimage/raw/master/img/image-20211010223532743.png) 



5. 选择项目子路径

   ![image-20211010223648189](https://gitee.com/testlyx/cloudimage/raw/master/img/image-20211010223648189.png) 



6. 选择1.8 format

   ![image-20211010223723680](https://gitee.com/testlyx/cloudimage/raw/master/img/image-20211010223723680.png) 



7. 选择在当前窗口打开

   ![image-20211010223805708](https://gitee.com/testlyx/cloudimage/raw/master/img/image-20211010223805708.png) 



8. 选择ADD

   ![image-20211010223855051](https://gitee.com/testlyx/cloudimage/raw/master/img/image-20211010223855051.png) 



9. 成功后新增svn按钮

   ![image-20211010224704793](https://gitee.com/testlyx/cloudimage/raw/master/img/image-20211010224704793.png) 



### 5.3 提交代码

1. 修改完代码后，点击绿色对钩提交

   ![image-20211010224734171](https://gitee.com/testlyx/cloudimage/raw/master/img/image-20211010224734171.png) 



2. 添加注释信息，然后COMMIT

   ![image-20211010224850404](https://gitee.com/testlyx/cloudimage/raw/master/img/image-20211010224850404.png) 



3. 进度条显示提交进度

   ![image-20211010224945207](https://gitee.com/testlyx/cloudimage/raw/master/img/image-20211010224945207.png) 





### 5.4 更新代码

1. 选择蓝色箭头更新代码

   ![image-20211010225159170](https://gitee.com/testlyx/cloudimage/raw/master/img/image-20211010225159170.png) 



2. 默认即可，选择ok

   ![image-20211010225423254](https://gitee.com/testlyx/cloudimage/raw/master/img/image-20211010225423254.png) 



3. 更新成功

   ![image-20211010225453751](https://gitee.com/testlyx/cloudimage/raw/master/img/image-20211010225453751.png) 



### 5.5 导入项目

1. 选择VCS， 选择Import into Subversion...

   ![image-20211010225619546](https://gitee.com/testlyx/cloudimage/raw/master/img/image-20211010225619546.png) 



2. 配置远程仓库地址

   ![image-20211010225837781](https://gitee.com/testlyx/cloudimage/raw/master/img/image-20211010225837781.png) 



3. 选择刚刚添加的url，选择import

   ![image-20211010225912538](https://gitee.com/testlyx/cloudimage/raw/master/img/image-20211010225912538.png) 



4. 选择自己要上传的项目,点击ok

    ![image-20211010230253450](https://gitee.com/testlyx/cloudimage/raw/master/img/image-20211010230253450.png) 



5. 添加注释，选择ok

   ![image-20211010230122852](https://gitee.com/testlyx/cloudimage/raw/master/img/image-20211010230122852.png) 



6. 上传成功

   ![image-20211010230220693](https://gitee.com/testlyx/cloudimage/raw/master/img/image-20211010230220693.png) 





### 5.6 版本冲突问题 

1. 如4.6中相同情况参数冲突

   ![image-20211010230707947](https://gitee.com/testlyx/cloudimage/raw/master/img/image-20211010230707947.png) 

2. 此时点击更新操作

   ![image-20211010230905790](https://gitee.com/testlyx/cloudimage/raw/master/img/image-20211010230905790.png) 



3. 手动处理异常

   ![image-20211010231012970](https://gitee.com/testlyx/cloudimage/raw/master/img/image-20211010231012970.png) 

   ![image-20211010231101851](https://gitee.com/testlyx/cloudimage/raw/master/img/image-20211010231101851.png) 



4. 处理好冲突后选择apply

   ![image-20211010231151187](https://gitee.com/testlyx/cloudimage/raw/master/img/image-20211010231151187.png) 