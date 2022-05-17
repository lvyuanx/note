# Shiro

[TOC]

## 1、Shiro简介

官网：https://shiro.apache.org/

### 1.1 什么是Shiro

`Shiro`是一个功能强大且易于使用的Java安全框架，它执行身份验证、授权、加密和会话管理。使用Shiro易于理解的API，您可以快速轻松地保护任何应用程序—从最小的移动应用程序到最大的web和企业应用程序



### 1.2 shiro核心架构

![image-20211128150323858](https://gitee.com/testlyx/cloudimage/raw/master/img/image-20211128150323858.png)

* **Subject**
  __Subject即主体，外部应用与subject进行交互，subject记录了当前的操作用户，将用户的概念理解为当前操作的主体__。外部程序通过subject进行认证授权，而subject是通过SecurityManager安全管理器进行认证授权

  

* **SecurityManager**
  **SecurityManager即安全管理器，对全部的subject进行安全管理，它是shiro的核心，负责对所有的subject进行安全管理**。通过SecurityManager可以完成subject的认证、授权等，实质上SecurityManager是通过Authenticator进行认证，通过Authorizer进行授权，通过SessionManager进行会话管理等

  ==SecurityManager是一个接口，继承了Authenticator, Authorizer, SessionManager这三个接口==

  

* **Authenticator**
  **Authenticator即认证器，对用户身份进行认证**，Authenticator是一个接口，shiro提供ModularRealmAuthenticator实现类，通过ModularRealmAuthenticator基本上可以满足大多数需求，也可以自定义认证器

  

* **Authorizer**
  **Authorizer即授权器，用户通过认证器认证通过**，在访问功能时需要通过授权器判断用户是否有此功能的操作权限

  

* **Realm**
  Realm即领域，相当于datasource数据源，**securityManager进行安全认证需要通过Realm获取用户权限数据**，比如：如果用户身份数据在数据库那么realm就需要从数据库获取用户身份信息

  > 不要把realm理解成只是从数据源取数据，在realm中还有认证授权校验的相关的代码

  

* **SessionManager**
  **sessionManager即会话管理**，shiro框架定义了一套会话管理，**它不依赖web容器的session**，所以shiro可以使用在非web应用上，也可以将分布式应用的会话集中在一点管理，此特性可使它实现单点登录

  

* **SessionDAO**
  SessionDAO即会话dao，是对session会话操作的一套接口，比如要将session存储到数据库，可以通过jdbc将会话存储到数据库

  

* **CacheManager**
  **CacheManager即缓存管理，将用户权限数据存储在缓存，这样可以提高性能**

  

* **Cryptography**
  Cryptography即密码管理，**shiro提供了一套加密/解密的组件**，方便开发。比如提供常用的散列、加/解密等功能。



## 2、Shiro中的认证

### 2.1什么是认证

身份认证，就是判断一个用户是否为合法用户的处理过程。最常用的简单身份认证方式是系统通过核对用户输入的用户名和口令，看其是否与系统中存储的该用户的用户名和口令一致，来判断用户身份是否正确



### 2.2 三个概念
**Subject**
访问系统的用户，主体可以是用户、程序等，进行认证的都称为主体

**Principal**
**身份信息，是主体（subject）进行身份认证的标识**，标识必须具有唯一性，如用户名、手机号、邮箱地址等，一个主体可以有多个身份，但是必须有一个主身份（Primary Principal）

**credential**
凭证信息，是只有主体自己知道的安全信息，如密码、证书等



### 2.3 案例

1. 导入Shiro依赖

   ```xml
   <!-- shiro依赖 -->
   <dependency>
       <groupId>org.apache.shiro</groupId>
       <artifactId>shiro-core</artifactId>
       <version>1.4.2</version>
   </dependency>
   ```

2. 编写Shiro配置文件`shiro.ini`

   ```ini
   [users]
   # 用户名zhangsan，密码123
   zhangsan=123
   # 用户名admin，密码admin，拥有权限role1，role2
   admin=admin,role1,role2
   ```

3. 编写测试代码(模拟用户登录)

   ```java
   @RequestMapping("/login")
   private String login(String username, String password){
       // 1.创建安全管理器对象
       DefaultSecurityManager securityManager = new DefaultSecurityManager();
       // 2.给安全管理器设置realm
       securityManager.setRealm(new IniRealm("classpath:shiro.ini"));
       // 3.给全局安全管理工具类SecurityUtils设置安全管理器
       SecurityUtils.setSecurityManager(securityManager);
       // 4.拿到当前的subject
       Subject subject = SecurityUtils.getSubject();
       // 5.创建令牌
       UsernamePasswordToken token = new UsernamePasswordToken(username, password);
       try {
           // 6.用户认证
           log.info("认证状态: " + subject.isAuthenticated());
           subject.login(token);
           log.info("认证状态: " + subject.isAuthenticated());
       } catch (UnknownAccountException e){
           log.error(e.getMessage(), e);
           return "用户不存在";
       } catch (IncorrectCredentialsException e){
           log.error(e.getMessage(), e);
           return "用户密码错误";
       } catch (Exception e){
           log.error(e.getMessage(), e);
           return "认证失败";
       }
       return "用户登录成功";
   }
   ```



### 2.4 认证的几种状态

* UnknownAccountException：用户名错误
* IncorrectCredentialsException：密码错误
* DisabledAccountException：账号被禁用
* LockedAccountException：账号被锁定
* ExcessiveAttemptsException：登录失败次数过多
* ExpiredCredentialsException：凭证过期



### 2.5 Shiro使用自定义Relam实现认证

上面我们实现了简单的认证并且分析了认证的基本流程，通常情况下shiro的认证都是通过自定义relam来实现的

==使用自定义relam，配置文件将不在生效==

* 编写MyRelam代码

  ```java
  package com.lvyx.shiro_boot01.shiro;
  
  import com.lvyx.shiro_boot01.entity.User;
  import jdk.nashorn.internal.parser.Token;
  import lombok.extern.slf4j.Slf4j;
  import org.apache.shiro.authc.AuthenticationException;
  import org.apache.shiro.authc.AuthenticationInfo;
  import org.apache.shiro.authc.AuthenticationToken;
  import org.apache.shiro.authc.SimpleAuthenticationInfo;
  import org.apache.shiro.authz.AuthorizationInfo;
  import org.apache.shiro.realm.AuthorizingRealm;
  import org.apache.shiro.subject.PrincipalCollection;
  import org.springframework.util.ObjectUtils;
  
  /**
   * <p>
   * 自定义realm
   * </p>
   *
   * @author lvyx
   * @since 2021-11-28 15:42:02
   */
  @Slf4j
  public class MyRealm extends AuthorizingRealm {
  
      /**
       * 授权
       * @param principalCollection 身份集合
       * @return org.apache.shiro.authz.AuthorizationInfo
       * @author lvyx
       * @since 2021/11/28 15:43
       **/
      @Override
      protected AuthorizationInfo doGetAuthorizationInfo(PrincipalCollection principalCollection) {
          return null;
      }
  
      /**
       * 认证
       * @param authenticationToken 用于收集用户提交的身份（如用户名）及凭据（如密码）
       * @return org.apache.shiro.authc.AuthenticationInfo
       * @author lvyx
       * @since 2021/11/28 15:44
       **/
      @Override
      protected AuthenticationInfo doGetAuthenticationInfo(AuthenticationToken authenticationToken) throws AuthenticationException {
          // 在token中获取用户名
          String principal = (String) authenticationToken.getPrincipal();
          log.info("用户名：" + principal);
          // 模拟数据库查询
          User user = new User("admin", "admin");
          if (!ObjectUtils.isEmpty(user)){
              /*
               * 认证
               *  参数说明：用户名 | 密码 | 当前realm的名字
               *  shiro会自动帮助我们比较用户输入的密码和数据库中查出来的密码是否相同
               **/
              return new SimpleAuthenticationInfo(principal, user.getPassword(), this.getName());
          }
          // 用户不存在
          return null;
      }
  }
  ```

* 模拟用户登录

  ```java
  package com.lvyx.shiro_boot01.controller;
  
  import com.lvyx.shiro_boot01.shiro.MyRelam;
  import lombok.extern.slf4j.Slf4j;
  import org.apache.shiro.SecurityUtils;
  import org.apache.shiro.authc.IncorrectCredentialsException;
  import org.apache.shiro.authc.UnknownAccountException;
  import org.apache.shiro.authc.UsernamePasswordToken;
  import org.apache.shiro.mgt.DefaultSecurityManager;
  import org.apache.shiro.realm.text.IniRealm;
  import org.apache.shiro.subject.Subject;
  import org.springframework.web.bind.annotation.RequestMapping;
  import org.springframework.web.bind.annotation.RequestParam;
  import org.springframework.web.bind.annotation.RestController;
  
  /**
   * <p>
   *  模拟用户登录
   * </p>
   *
   * @author lvyx
   * @since 2021-11-28 15:24:18
   */
  @Slf4j
  @RestController
  @RequestMapping("/user")
  public class UserController {
  
      @RequestMapping("/login")
      private String login(String username, String password){
          // 1.创建安全管理器对象
          DefaultSecurityManager securityManager = new DefaultSecurityManager();
          // 2.给安全管理器设置realm
  //        securityManager.setRealm(new IniRealm("classpath:shiro.ini"));
          // 使用自定义realm
          securityManager.setRealm(new MyRealm());
          // 3.给全局安全管理工具类SecurityUtils设置安全管理器
          SecurityUtils.setSecurityManager(securityManager);
          // 4.拿到当前的subject
          Subject subject = SecurityUtils.getSubject();
          // 5.创建令牌
          UsernamePasswordToken token = new UsernamePasswordToken(username, password);
          try {
              // 6.用户认证
              log.info("认证状态: " + subject.isAuthenticated());
              subject.login(token);
              log.info("认证状态: " + subject.isAuthenticated());
          } catch (UnknownAccountException e){
              log.error(e.getMessage(), e);
              return "用户不存在";
          } catch (IncorrectCredentialsException e){
              log.error(e.getMessage(), e);
              return "用户密码错误";
          } catch (Exception e){
              log.error(e.getMessage(), e);
              return "认证失败";
          }
          return "用户登录成功";
      }
  }
  ```



### 2.6 Shiro的加密和随机盐
#### 2.6.1 Shiro中密码的加密策略
实际应用中用户的密码并不是明文存储在数据库中的，而是采用一种加密算法将密码加密后存储在数据库中。Shiro中提供了一整套的加密算法，并且提供了随机盐。shiro使用指定的加密算法将用户密码和随机盐进行加密，并按照指定的散列次数将散列后的密码存储在数据库中。由于随机盐每个用户可以不同，这就极大的提高了密码的安全性。



#### 2.5.2 shiro 加密

```java
@Test
public void testMD5(){
    // MD5加密
    Md5Hash md5Hash1 = new Md5Hash("admin");
    System.out.println("md5加密："+ md5Hash1.toHex());

    // MD5加盐加密
    Md5Hash md5Hash2 = new Md5Hash("admin", "qwerty");
    System.out.println("md5加盐加密："+ md5Hash2.toHex());

    // MD5加盐散列加密
    Md5Hash md5Hash3 = new Md5Hash("admin", "qwerty", 1024);
    System.out.println("md5加盐散列加密："+ md5Hash2.toHex());
}
```

运行结果：

![image-20211128161436998](https://gitee.com/testlyx/cloudimage/raw/master/img/image-20211128161436998.png)



### 2.7 Shiro自定义加密Realm

* 自定义relam

  ```java
  package com.lvyx.shiro_boot01.shiro;
  
  import com.lvyx.shiro_boot01.entity.User;
  import jdk.nashorn.internal.parser.Token;
  import lombok.extern.slf4j.Slf4j;
  import org.apache.shiro.authc.AuthenticationException;
  import org.apache.shiro.authc.AuthenticationInfo;
  import org.apache.shiro.authc.AuthenticationToken;
  import org.apache.shiro.authc.SimpleAuthenticationInfo;
  import org.apache.shiro.authz.AuthorizationInfo;
  import org.apache.shiro.realm.AuthorizingRealm;
  import org.apache.shiro.subject.PrincipalCollection;
  import org.apache.shiro.util.ByteSource;
  import org.springframework.util.ObjectUtils;
  
  /**
   * <p>
   * 自定义relam
   * </p>
   *
   * @author lvyx
   * @since 2021-11-28 15:42:02
   */
  @Slf4j
  public class MyRealm extends AuthorizingRealm {
  
      /**
       * 授权
       * @param principalCollection 身份集合
       * @return org.apache.shiro.authz.AuthorizationInfo
       * @author lvyx
       * @since 2021/11/28 15:43
       **/
      @Override
      protected AuthorizationInfo doGetAuthorizationInfo(PrincipalCollection principalCollection) {
          return null;
      }
  
      /**
       * 认证
       * @param authenticationToken 用于收集用户提交的身份（如用户名）及凭据（如密码）
       * @return org.apache.shiro.authc.AuthenticationInfo
       * @author lvyx
       * @since 2021/11/28 15:44
       **/
      @Override
      protected AuthenticationInfo doGetAuthenticationInfo(AuthenticationToken authenticationToken) throws AuthenticationException {
          // 在token中获取用户名
          String principal = (String) authenticationToken.getPrincipal();
          log.info("用户名：" + principal);
          // 模拟数据库查询
          User user = new User("admin", "67178a593adc05a7048eec9e5b017b34");
          if (!ObjectUtils.isEmpty(user)){
              /*
               * 认证
               *  参数说明：用户名 | 加密后的密码 | 随机盐 | 当前realm的名字
               *  shiro会自动帮助我们比较用户输入的密码和数据库中查出来的密码是否相同
               **/
              return new SimpleAuthenticationInfo(principal,
                      user.getPassword(),
                      ByteSource.Util.bytes("qwerty"),
                      this.getName());
          }
          // 用户不存在
          return null;
      }
  }
  ```

* 模拟用户登录

  ```java
  package com.lvyx.shiro_boot01.controller;
  
  import com.lvyx.shiro_boot01.shiro.MyRealm;
  import lombok.extern.slf4j.Slf4j;
  import org.apache.shiro.SecurityUtils;
  import org.apache.shiro.authc.IncorrectCredentialsException;
  import org.apache.shiro.authc.UnknownAccountException;
  import org.apache.shiro.authc.UsernamePasswordToken;
  import org.apache.shiro.authc.credential.HashedCredentialsMatcher;
  import org.apache.shiro.mgt.DefaultSecurityManager;
  import org.apache.shiro.subject.Subject;
  import org.springframework.web.bind.annotation.RequestMapping;
  import org.springframework.web.bind.annotation.RestController;
  
  /**
   * <p>
   *  模拟用户登录
   * </p>
   *
   * @author lvyx
   * @since 2021-11-28 15:24:18
   */
  @Slf4j
  @RestController
  @RequestMapping("/user")
  public class UserController {
  
      @RequestMapping("/login")
      private String login(String username, String password){
          // 1.创建安全管理器对象
          DefaultSecurityManager securityManager = new DefaultSecurityManager();
          // 2.给安全管理器设置realm
          // 为realm设置凭证匹配器
          HashedCredentialsMatcher hashedCredentialsMatcher = new HashedCredentialsMatcher();
          // 加密算法
          hashedCredentialsMatcher.setHashAlgorithmName("md5");
          // hash次数
          hashedCredentialsMatcher.setHashIterations(1024);
          MyRealm myRealm = new MyRealm();
          myRealm.setCredentialsMatcher(hashedCredentialsMatcher);
          // 使用自定义realm
          securityManager.setRealm(myRealm);
          // 3.给全局安全管理工具类SecurityUtils设置安全管理器
          SecurityUtils.setSecurityManager(securityManager);
          // 4.拿到当前的subject
          Subject subject = SecurityUtils.getSubject();
          // 5.创建令牌
          UsernamePasswordToken token = new UsernamePasswordToken(username, password);
          try {
              // 6.用户认证
              log.info("认证状态: " + subject.isAuthenticated());
              subject.login(token);
              log.info("认证状态: " + subject.isAuthenticated());
          } catch (UnknownAccountException e){
              log.error(e.getMessage(), e);
              return "用户不存在";
          } catch (IncorrectCredentialsException e){
              log.error(e.getMessage(), e);
              return "用户密码错误";
          } catch (Exception e){
              log.error(e.getMessage(), e);
              return "认证失败";
          }
          return "用户登录成功";
      }
  }
  ```




## 3、Shiro中的授权
### 2.1 什么是授权

授权可简单理解为who对what(which)进行How操作：

* **Who，即主体（Subject）**，主体需要访问系统中的资源。
* **What，即资源（Resource)**，如系统菜单、页面、按钮、类方法、系统商品信息等。资源包括资源类型和资源实例，比如商品信息为资源类型，类型为t01的商品为资源实例，编号为001的商品信息也属于资源实例。
* **How，权限/许可（Permission)**，规定了主体对资源的操作许可，权限离开资源没有意义，如用户查询权限、用户添加权限、某个类方法的调用权限、编号为001用户的修改权限等，通过权限可知主体对哪些资源都有哪些操作许可。



### 2.2 授权方式

#### 2.2.1 基于角色的访问控制

> RBAC基于角色的访问控制（Role-Based Access Control）是以角色为中心进行访问控制

```java
// 主体拥有admin角色
if(subject.hasRole("admin")){
   //操作什么资源
}
```

#### 2.2.2 基于资源的访问控制

> RBAC基于资源的访问控制（Resource-Based Access Control）是以资源为中心进行访问控制

```java
if(subject.isPermission("user:update:01")){ //资源实例
  //对01用户进行修改
}
if(subject.isPermission("user:update:*")){  //资源类型
  //对01用户进行修改
}
```



### 2.3 权限字符串

 权限字符串的规则是：`资源标识符:操作:资源实例标识符`，意思是对哪个资源的哪个实例具有什么操作，“:”是资源/操作/实例的分割符，权限字符串也可以使用*通配符。

例子：

* 用户创建权限：user:create，或user:create:*
* 用户修改实例001的权限：user:update:001
* 用户实例001的所有权限：user:*：001



### 2.4 权限的编码方式

#### 2.4.1 编程式

```java
Subject subject = SecurityUtils.getSubject();
if(subject.hasRole("admin")) {
	//有权限
} else {
	//无权限
}
```

#### 2.4.2 注解式

```java
@RequiresRoles("admin")
public void hello() {
	//有权限
}
```

#### 2.4.3 标签式

```jsp
JSP/GSP 标签：在JSP/GSP 页面通过相应的标签完成：
<shiro:hasRole name="admin">
	<!— 有权限—>
</shiro:hasRole>
注意: Thymeleaf 中使用shiro需要额外集成!
```



### 2.5 案例

> 根据以上的加密案例修改

* 自定义realm

  ```java
  package com.lvyx.shiro_boot01.shiro;
  
  import com.lvyx.shiro_boot01.entity.User;
  import jdk.nashorn.internal.parser.Token;
  import lombok.extern.slf4j.Slf4j;
  import org.apache.shiro.authc.AuthenticationException;
  import org.apache.shiro.authc.AuthenticationInfo;
  import org.apache.shiro.authc.AuthenticationToken;
  import org.apache.shiro.authc.SimpleAuthenticationInfo;
  import org.apache.shiro.authz.AuthorizationInfo;
  import org.apache.shiro.authz.SimpleAuthorizationInfo;
  import org.apache.shiro.realm.AuthorizingRealm;
  import org.apache.shiro.subject.PrincipalCollection;
  import org.apache.shiro.util.ByteSource;
  import org.springframework.util.ObjectUtils;
  
  import java.util.Arrays;
  import java.util.List;
  
  /**
   * <p>
   * 自定义relam
   * </p>
   *
   * @author lvyx
   * @since 2021-11-28 15:42:02
   */
  @Slf4j
  public class MyRealm extends AuthorizingRealm {
  
      /**
       * 授权
       * @param principalCollection 身份集合
       * @return org.apache.shiro.authz.AuthorizationInfo
       * @author lvyx
       * @since 2021/11/28 15:43
       **/
      @Override
      protected AuthorizationInfo doGetAuthorizationInfo(PrincipalCollection principalCollection) {
          // 从系统返回的身份信息中的到用户名，模拟从数据库中的到用户角色权限相关信息
          String username = (String) principalCollection.getPrimaryPrincipal();
          // 模拟从数据库中得到的角色和权限信息
          List<String> roles = Arrays.asList("admin", "user", "visitor");
          List<String> permission = Arrays.asList("user:add:*", "user:delete:*", "user:find:*");
          SimpleAuthorizationInfo simpleAuthorizationInfo = new SimpleAuthorizationInfo();
          simpleAuthorizationInfo.addRoles(roles);
          simpleAuthorizationInfo.addStringPermissions(permission);
          return simpleAuthorizationInfo;
      }
  
      /**
       * 认证
       * @param authenticationToken 用于收集用户提交的身份（如用户名）及凭据（如密码）
       * @return org.apache.shiro.authc.AuthenticationInfo
       * @author lvyx
       * @since 2021/11/28 15:44
       **/
      @Override
      protected AuthenticationInfo doGetAuthenticationInfo(AuthenticationToken authenticationToken) throws AuthenticationException {
          // 在token中获取用户名
          String principal = (String) authenticationToken.getPrincipal();
          log.info("用户名：" + principal);
          // 模拟数据库查询
          User user = new User("admin", "67178a593adc05a7048eec9e5b017b34");
          if (!ObjectUtils.isEmpty(user)){
              /*
               * 认证
               *  参数说明：用户名 | 加密后的密码 | 随机盐 | 当前realm的名字
               *  shiro会自动帮助我们比较用户输入的密码和数据库中查出来的密码是否相同
               **/
              return new SimpleAuthenticationInfo(principal,
                      user.getPassword(),
                      ByteSource.Util.bytes("qwerty"),
                      this.getName());
          }
          // 用户不存在
          return null;
      }
  }
  ```

* 模拟用户登录

  ```java
  package com.lvyx.shiro_boot01.controller;
  
  import com.lvyx.shiro_boot01.shiro.MyRealm;
  import lombok.extern.slf4j.Slf4j;
  import org.apache.shiro.SecurityUtils;
  import org.apache.shiro.authc.IncorrectCredentialsException;
  import org.apache.shiro.authc.UnknownAccountException;
  import org.apache.shiro.authc.UsernamePasswordToken;
  import org.apache.shiro.authc.credential.HashedCredentialsMatcher;
  import org.apache.shiro.mgt.DefaultSecurityManager;
  import org.apache.shiro.subject.Subject;
  import org.springframework.web.bind.annotation.RequestMapping;
  import org.springframework.web.bind.annotation.RestController;
  
  import java.util.Arrays;
  
  /**
   * <p>
   *  模拟用户登录
   * </p>
   *
   * @author lvyx
   * @since 2021-11-28 15:24:18
   */
  @Slf4j
  @RestController
  @RequestMapping("/user")
  public class UserController {
  
      @RequestMapping("/login")
      private String login(String username, String password){
          // 1.创建安全管理器对象
          DefaultSecurityManager securityManager = new DefaultSecurityManager();
          // 2.给安全管理器设置realm
          // 为realm设置凭证匹配器
          HashedCredentialsMatcher hashedCredentialsMatcher = new HashedCredentialsMatcher();
          // 加密算法
          hashedCredentialsMatcher.setHashAlgorithmName("md5");
          // hash次数
          hashedCredentialsMatcher.setHashIterations(1024);
          MyRealm myRealm = new MyRealm();
          myRealm.setCredentialsMatcher(hashedCredentialsMatcher);
          // 使用自定义realm
          securityManager.setRealm(myRealm);
          // 3.给全局安全管理工具类SecurityUtils设置安全管理器
          SecurityUtils.setSecurityManager(securityManager);
          // 4.拿到当前的subject
          Subject subject = SecurityUtils.getSubject();
          // 5.创建令牌
          UsernamePasswordToken token = new UsernamePasswordToken(username, password);
          try {
              // 6.用户认证
              log.info("认证状态: " + subject.isAuthenticated());
              subject.login(token);
              log.info("认证状态: " + subject.isAuthenticated());
          } catch (UnknownAccountException e){
              log.error(e.getMessage(), e);
              return "用户不存在";
          } catch (IncorrectCredentialsException e){
              log.error(e.getMessage(), e);
              return "用户密码错误";
          } catch (Exception e){
              log.error(e.getMessage(), e);
              return "认证失败";
          }
          //授权
          if(subject.isAuthenticated()){
              //基于角色权限控制
              System.out.println("具有权限admin：" + subject.hasRole("admin"));
  
              //基于多角色权限控制(同时具有)
              System.out.println("同时具有具有权限admin、super："+subject.hasAllRoles(Arrays.asList("admin", "super")));
  
              //是否具有其中一个角色
              boolean[] booleans = subject.hasRoles(Arrays.asList("admin", "super", "user"));
              for (boolean aBoolean : booleans) {
                  System.out.println(aBoolean);
              }
  
              System.out.println("==============================================");
  
              //基于权限字符串的访问控制  资源标识符:操作:资源类型
              System.out.println("user:find:001 权限:"+subject.isPermitted("user:find:001"));
              System.out.println("product:create:02 权限:"+subject.isPermitted("product:create:02"));
  
              //分别具有那些权限
              boolean[] permitted = subject.isPermitted("user:*:001", "user:find:111");
              for (boolean b : permitted) {
                  System.out.println(b);
              }
  
              //同时具有哪些权限
              boolean permittedAll = subject.isPermittedAll("user:*:01", "user:delete:001");
              System.out.println(permittedAll);
          }
          return "用户登录成功";
      }
  }
  ```

  **运行结果：**

  ![image-20211129103757916](https://gitee.com/testlyx/cloudimage/raw/master/img/image-20211129103757916.png)

  

## 3、SpringBoot整合shiro

### 3.1 导入依赖

```xml
<!-- hutool工具包-->
<dependency>
    <groupId>cn.hutool</groupId>
    <artifactId>hutool-all</artifactId>
    <version>5.7.16</version>
</dependency>
<!--代码生成器-->
<dependency>
    <groupId>com.baomidou</groupId>
    <artifactId>mybatis-plus-generator</artifactId>
    <version>3.5.1</version>
</dependency>
<!--freemarker模板和velocity模板依赖，后面配置的时候会2选其1-->
<dependency>
    <groupId>org.freemarker</groupId>
    <artifactId>freemarker</artifactId>
</dependency>
<dependency>
    <groupId>org.apache.velocity</groupId>
    <artifactId>velocity-engine-core</artifactId>
    <version>2.3</version>
</dependency>
<!--swagger依赖-->
<dependency>
    <groupId>io.swagger</groupId>
    <artifactId>swagger-annotations</artifactId>
    <version>1.6.3</version>
</dependency>
<!-- 数据库连接驱动 -->
<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
    <version>8.0.25</version>
</dependency>
<!--数据连接池-->
<dependency>
    <groupId>com.alibaba</groupId>
    <artifactId>druid</artifactId>
    <version>1.2.8</version>
</dependency>
<!-- springBoot整合mybatis-plus-->
<dependency>
    <groupId>com.baomidou</groupId>
    <artifactId>mybatis-plus-boot-starter</artifactId>
    <version>3.4.3.4</version>
</dependency>
<!-- shiro -->
<dependency>
    <groupId>org.apache.shiro</groupId>
    <artifactId>shiro-spring-boot-starter</artifactId>
    <version>1.7.1</version>
</dependency>
<!-- spring web场景启动器 -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>
<dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
    <optional>true</optional>
</dependency>
<!-- 热部署插件 -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-devtools</artifactId>
    <scope>runtime</scope>
    <optional>true</optional>
</dependency>
<!-- springBoot 测试启动器-->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-test</artifactId>
    <scope>test</scope>
    <exclusions>
        <exclusion>
            <groupId>org.junit.vintage</groupId>
            <artifactId>junit-vintage-engine</artifactId>
        </exclusion>
    </exclusions>
</dependency>
```

### 3.2 实现认证

#### 3.2.1 创建Shiro配置文件ShiroConfig

```java
package com.lvyx.shiro_boot02.shiro.config;

import org.apache.shiro.authc.credential.HashedCredentialsMatcher;
import org.apache.shiro.realm.AuthorizingRealm;
import org.apache.shiro.spring.web.ShiroFilterFactoryBean;
import org.apache.shiro.web.mgt.DefaultWebSecurityManager;
import org.springframework.aop.framework.autoproxy.DefaultAdvisorAutoProxyCreator;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.HashMap;
import java.util.Map;

/**
 * <p>
 * shiro配置类
 * </p>
 *
 * @author lvyx
 * @since 2021-11-30 09:56:43
 */
@Configuration
public class ShiroConfig {

    /**
     * 安全管理器
     * @param realm realm
     * @return org.apache.shiro.web.mgt.DefaultWebSecurityManager
     * @author lvyx
     * @since 2021/11/30 10:20
     **/
    @Bean
    public DefaultWebSecurityManager getDefaultWebSecurityManger(AuthorizingRealm realm){
        DefaultWebSecurityManager defaultWebSecurityManager = new DefaultWebSecurityManager();
        // 设置密码匹配器
        HashedCredentialsMatcher credentialsMatcher = new HashedCredentialsMatcher();
        // 设置加密方式
        credentialsMatcher.setHashAlgorithmName("MD5");
        // 设置散列次数
        credentialsMatcher.setHashIterations(1024);
        realm.setCredentialsMatcher(credentialsMatcher);
        // 给安全管理器设置realm
        defaultWebSecurityManager.setRealm(realm);
        return defaultWebSecurityManager;
    }

    /**
     * shiroFilter负责拦截所有的请求
     * @param defaultWebSecurityManager 安全管理器
     * @return org.apache.shiro.spring.web.ShiroFilterFactoryBean
     * @author lvyx
     * @since 2021/11/30 10:26
     **/
    @Bean
    public ShiroFilterFactoryBean getShiroFilterFactioryBean(DefaultWebSecurityManager defaultWebSecurityManager){
        ShiroFilterFactoryBean shiroFilterFactoryBean = new ShiroFilterFactoryBean();

        // 给filter设置安全管理器
        shiroFilterFactoryBean.setSecurityManager(defaultWebSecurityManager);

        // 配置系统受限资源
        // 配置系统公共资源
        Map<String, String> map = new HashMap<>();
        // 放行的公共资源
        map.put("/user/login", "anon");
        map.put("/error/**", "anon");
        // 所有请求都需要认证和授权
        map.put("/**", "authc");

        // 默认认证的请求
        shiroFilterFactoryBean.setLoginUrl("/login.html");
        shiroFilterFactoryBean.setUnauthorizedUrl("/error/noAuthor");
        shiroFilterFactoryBean.setFilterChainDefinitionMap(map);

        return shiroFilterFactoryBean;
    }
}
```



#### 3.2.2 创建自定义Realm

```java
package com.lvyx.shiro_boot02.shiro.realm;

import com.lvyx.shiro_boot02.entity.User;
import com.lvyx.shiro_boot02.service.UserService;
import org.apache.shiro.authc.AuthenticationException;
import org.apache.shiro.authc.AuthenticationInfo;
import org.apache.shiro.authc.AuthenticationToken;
import org.apache.shiro.authc.SimpleAuthenticationInfo;
import org.apache.shiro.authz.AuthorizationInfo;
import org.apache.shiro.realm.AuthorizingRealm;
import org.apache.shiro.subject.PrincipalCollection;
import org.apache.shiro.util.ByteSource;
import org.springframework.stereotype.Component;

import javax.annotation.Resource;

/**
 * <p>
 * 自定义Realm
 * </p>
 *
 * @author lvyx
 * @since 2021-11-30 09:53:46
 */
@Component
public class MyRealm extends AuthorizingRealm {

    @Resource
    private UserService userService;

    /**
     * 授权
     * @param principalCollection  身份集合
     * @return org.apache.shiro.authz.AuthorizationInfo
     * @author lvyx
     * @since 2021/11/30 9:54
     **/
    @Override
    protected AuthorizationInfo doGetAuthorizationInfo(PrincipalCollection principalCollection) {
        return null;
    }

    /**
     * 认证
     * @param authenticationToken 用于收集用户提交的身份（如用户名）及凭据（如密码）
     * @return org.apache.shiro.authc.AuthenticationInfo
     * @author lvyx
     * @since 2021/11/30 9:55
     **/
    @Override
    protected AuthenticationInfo doGetAuthenticationInfo(AuthenticationToken authenticationToken) throws AuthenticationException {
        String username = (String) authenticationToken.getPrincipal();
        // 根据用户名得到用户
        User byName = userService.getByName(username);
        if (byName != null) {
            /*
             * * 认证
             *   *  参数说明：用户名 | 加密后的密码 | 随机盐 | 当前realm的名字
             **/
            return new SimpleAuthenticationInfo(
                    byName.getUsername(),
                    byName.getPassword(),
                    ByteSource.Util.bytes(username),
                    this.getName());
        }
        return null;
    }
}
```



#### 3.2.3 创建Service实现根据用户名查询用户

```java
/**
  * 根据用户名的到用户信息
  * @param username 用户名
  * @return com.lvyx.shiro_boot02.entity.User
  * @author lvyx
  * @since 2021/11/30 16:11
  **/
@Override
public User getByName(String username) {
    LambdaUpdateWrapper<User> wrapper = new LambdaUpdateWrapper<>();
    wrapper.eq(User::getUsername, username);
    return getOne(wrapper);
}
```





#### 3.2.3 创建Controller实现登录和退出登录

```java
package com.lvyx.shiro_boot02.controller;

import com.lvyx.shiro_boot02.annotation.logger.LLogger;
import com.lvyx.shiro_boot02.entity.User;
import com.lvyx.shiro_boot02.service.UserService;
import com.lvyx.shiro_boot02.vo.Result;
import lombok.extern.slf4j.Slf4j;
import org.apache.logging.log4j.util.Strings;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authc.IncorrectCredentialsException;
import org.apache.shiro.authc.UnknownAccountException;
import org.apache.shiro.authc.UsernamePasswordToken;
import org.apache.shiro.subject.Subject;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;
import java.time.LocalDateTime;

/**
 * <p>
 * 用户前端控制器
 * </p>
 *
 * @author lvyx
 * @since 2021-11-30 10:31:10
 */
@Slf4j
@RestController
@RequestMapping("/user")
public class UserController {

    @Resource
    private UserService userService;

    /**
     * 用户登录
     * @param username 用户名
     * @param password 密码
     * @return com.lvyx.shiro_boot02.vo.Result
     * @author lvyx
     * @since 2021/11/30 10:56
     **/
    @LLogger(doc = "登录方法", params = {"用户名", "密码"})
    @RequestMapping("/login")
    public Result login(String username, String password){
        Subject subject = SecurityUtils.getSubject();
        try {
            subject.login(new UsernamePasswordToken(username, password));
        } catch (UnknownAccountException e){
            log.error(e.getMessage(), e);
            return Result.error(403, "该用户暂未注册！");
        } catch (IncorrectCredentialsException e){
            log.error(e.getMessage(), e);
            return Result.error(403, "用户名或密码错误！");
        } catch (Exception e){
            log.error(e.getMessage(), e);
            return Result.error(403, "登录认证失败！");
        }
        return Result.success(200, "登录成功！");
    }

    /**
     * 退出登录
     * @return com.lvyx.shiro_boot02.vo.Result
     * @author lvyx
     * @since 2021/11/30 17:39
     **/
    @LLogger(doc = "退出登录")
    @RequestMapping("/logout")
    public Result logout(){
        Subject subject = SecurityUtils.getSubject();
        if (subject.isAuthenticated()){
            subject.logout();
            return Result.success("退出登录成功");
        }else {
            return Result.error(403, "请先登录！");
        }
    }
}

```



#### 3.2.4 创建用户表

```mysql
CREATE TABLE `t_user` (
  `ID` varchar(36) NOT NULL COMMENT '用户ID',
  `USERNAME` varchar(20) DEFAULT NULL COMMENT '用户名',
  `PASSWORD` text COMMENT '密码（0:女，1:男）',
  `SEX` tinyint(1) DEFAULT '1' COMMENT '性别',
  `IS_DELETE` tinyint(1) DEFAULT '0' COMMENT '是否删除（0:未删除，1:删除）',
  `CREATE_USER` varchar(36) DEFAULT NULL COMMENT '创建用户ID',
  `CREATE_TIME` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `UPDATE_USER` varchar(36) DEFAULT NULL COMMENT '修改用户ID',
  `UPDATE_TIME` datetime DEFAULT NULL COMMENT '修改时间',
  `DELETE_USER` varchar(36) DEFAULT NULL COMMENT '删除用户ID',
  `DELETE_TIME` datetime DEFAULT NULL COMMENT '删除时间',
  PRIMARY KEY (`ID`),
  UNIQUE KEY `uni_user_name` (`USERNAME`) USING BTREE COMMENT '用户名唯一索引'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='用户信息表';
```





### 3.3 Shiro中常见的过滤器

| 配置缩写 | 对应的过滤器 | 功能 |
| ---- | ---- | ---- |
| anon | AnonymousFilter | 指定url可以匿名访问 |
|authc | FormAuthenticationFilter | 指定url需要form表单登录，默认会从请求中获取username、password,rememberMe等参数并尝试登录，如果登录不了就会跳转到loginUrl配置的路径。我们也可以用这个过滤器做默认的登录逻辑，但是一般都是我们自己在控制器写登录逻辑的，自己写的话出错返回的信息都可以定制嘛。|
| authcBasic | BasicHttpAuthenticationFilter | 指定url需要basic登录 |
| logout | LogoutFilter | 登出过滤器，配置指定url就可以实现退出功能，非常方便 |
| noSessionCreation | NoSessionCreationFilter | 禁止创建会话 |
| perms | PermissionsAuthorizationFilter | 需要指定权限才能访问 |
| port | PortFilter | 需要指定端口才能访问 |
| rest | HttpMethodPermissionFilter | 将http请求方法转化成相应的动词来构造一个权限字符串，这个感觉意义不大，有兴趣自己看源码的注释 |
| roles | RolesAuthorizationFilter | 需要指定角色才能访问 |
| ssl | SslFilter | 需要https请求才能访问 |
| user | UserFilter | 需要已登录或“记住我”的用户才能访问 |



### 3.3 实现授权

#### 3.3.1 基于角色的授权

##### a、创建数据库表

```mysql
-- 创建角色表
CREATE TABLE `t_role` (
  `ID` varchar(36) NOT NULL COMMENT '角色主键',
  `role_name` varchar(20) DEFAULT NULL COMMENT '角色名称',
  `is_delete` tinyint(1) DEFAULT '0' COMMENT '是否删除（0:未删除，1:删除）',
  `create_user` varchar(36) DEFAULT NULL COMMENT '创建用户',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_user` varchar(36) DEFAULT NULL COMMENT '修改用户',
  `update_time` datetime DEFAULT NULL COMMENT '修改时间',
  `delete_user` varchar(36) DEFAULT NULL COMMENT '删除用户',
  `delete_time` datetime DEFAULT NULL COMMENT '删除时间',
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='角色表';

-- 创建角色用户关联表
CREATE TABLE `t_role_user` (
  `ID` varchar(36) NOT NULL COMMENT '角色关联用户表ID',
  `role_id` varchar(36) DEFAULT NULL COMMENT '角色ID',
  `user_id` varchar(36) DEFAULT NULL COMMENT '用户ID',
  `is_delete` tinyint(1) DEFAULT '0' COMMENT '是否删除（0:未删除，1:删除）',
  `create_user` varchar(36) DEFAULT NULL COMMENT '创建用户',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_user` varchar(36) DEFAULT NULL COMMENT '修改用户',
  `update_time` datetime DEFAULT NULL COMMENT '修改时间',
  `delete_user` varchar(36) DEFAULT NULL COMMENT '删除用户',
  `delete_time` datetime DEFAULT NULL COMMENT '删除时间',
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='角色关联用户表';
```

![image-20211206190550737](https://gitee.com/testlyx/cloudimage/raw/master/img/image-20211206190550737.png)

![image-20211206190620228](https://gitee.com/testlyx/cloudimage/raw/master/img/image-20211206190620228.png)



##### b、修改realm

```java
package com.lvyx.shiro_boot02.shiro.realm;

import com.lvyx.shiro_boot02.entity.Role;
import com.lvyx.shiro_boot02.entity.User;
import com.lvyx.shiro_boot02.service.RoleService;
import com.lvyx.shiro_boot02.service.UserService;
import org.apache.shiro.authc.AuthenticationException;
import org.apache.shiro.authc.AuthenticationInfo;
import org.apache.shiro.authc.AuthenticationToken;
import org.apache.shiro.authc.SimpleAuthenticationInfo;
import org.apache.shiro.authz.AuthorizationInfo;
import org.apache.shiro.authz.SimpleAuthorizationInfo;
import org.apache.shiro.realm.AuthorizingRealm;
import org.apache.shiro.subject.PrincipalCollection;
import org.apache.shiro.util.ByteSource;
import org.apache.shiro.util.CollectionUtils;
import org.springframework.stereotype.Component;

import javax.annotation.Resource;
import java.util.ArrayList;
import java.util.List;

/**
 * <p>
 * 自定义Realm
 * </p>
 *
 * @author lvyx
 * @since 2021-11-30 09:53:46
 */
@Component
public class MyRealm extends AuthorizingRealm {

    @Resource
    private UserService userService;

    @Resource
    private RoleService roleService;

    /**
     * 授权
     * @param principalCollection  身份集合
     * @return org.apache.shiro.authz.AuthorizationInfo
     * @author lvyx
     * @since 2021/11/30 9:54
     **/
    @Override
    protected AuthorizationInfo doGetAuthorizationInfo(PrincipalCollection principalCollection) {
        // 用户名
        String username = (String) principalCollection.getPrimaryPrincipal();
        // 根据用户名的到用户的权限信息
        List<Role> roles = roleService.listRoleByUserName(username);
        if (!CollectionUtils.isEmpty(roles)){
            SimpleAuthorizationInfo simpleAuthorizationInfo = new SimpleAuthorizationInfo();
            ArrayList<String> roleNames = new ArrayList<>();
            roles.forEach(role -> {
                roleNames.add(role.getRoleName());
            });
            // 添加用户角色信息
            simpleAuthorizationInfo.addRoles(roleNames);
            return simpleAuthorizationInfo;
        }
        return null;
    }

    /**
     * 认证
     * @param authenticationToken 用于收集用户提交的身份（如用户名）及凭据（如密码）
     * @return org.apache.shiro.authc.AuthenticationInfo
     * @author lvyx
     * @since 2021/11/30 9:55
     **/
    @Override
    protected AuthenticationInfo doGetAuthenticationInfo(AuthenticationToken authenticationToken) throws AuthenticationException {
        String username = (String) authenticationToken.getPrincipal();
        // 根据用户名得到用户
        User byName = userService.getByName(username);
        if (byName != null) {
            /*
             * * 认证
             *   *  参数说明：用户名 | 加密后的密码 | 随机盐 | 当前realm的名字
             **/
            return new SimpleAuthenticationInfo(
                    byName.getUsername(),
                    byName.getPassword(),
                    ByteSource.Util.bytes(username),
                    this.getName());
        }
        return null;
    }
}
```



##### c、给需要授权的controller方法添加@RequiresRoles注解

```java
/**
  * 查询用户信息
  * @return com.lvyx.shiro_boot02.vo.Result
  * @author lvyx
  * @since 2021/12/1 17:14
  **/
@LLogger(doc = "查询用户信息")
@RequestMapping("/listUser")
@RequiresRoles({"admin"})
public Result listUser(){
    return Result.success(200, "查询用户成功",  userService.list());
}
```



#### 3.3.2 基于权限的授权

##### a、创建数据库表

```mysql
-- 创建权限表
CREATE TABLE `t_permission`(
	`ID` varchar(36) not null COMMENT '权限id',
	`name` varchar(20) default null COMMENT '权限名称',
	`url` varchar(80) default null COMMENT '路径url',
	`is_delete` TINYINT(1) default '0' COMMENT '是否删除（0：否，1：是）',
	`create_user` varchar(36) DEFAULT NULL COMMENT '创建用户',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_user` varchar(36) DEFAULT NULL COMMENT '修改用户',
  `update_time` datetime DEFAULT NULL COMMENT '修改时间',
  `delete_user` varchar(36) DEFAULT NULL COMMENT '删除用户',
  `delete_time` datetime DEFAULT NULL COMMENT '删除时间',
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='权限表';

-- 创建角色关联权限表
CREATE TABLE `t_role_permission` (
  `ID` varchar(36) NOT NULL COMMENT '角色关联权限ID',
  `role_id` varchar(36) DEFAULT NULL COMMENT '角色ID',
  `permission_id` varchar(36) DEFAULT NULL COMMENT '权限ID',
  `is_delete` tinyint(1) DEFAULT '0' COMMENT '是否删除（0：否，1：是）',
  `create_user` varchar(36) DEFAULT NULL COMMENT '创建用户',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_user` varchar(36) DEFAULT NULL COMMENT '修改用户',
  `update_time` datetime DEFAULT NULL COMMENT '修改时间',
  `delete_user` varchar(36) DEFAULT NULL COMMENT '删除用户',
  `delete_time` datetime DEFAULT NULL COMMENT '删除时间',
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='角色关联权限表';
```

![image-20211206190704362](https://gitee.com/testlyx/cloudimage/raw/master/img/image-20211206190704362.png)

![image-20211206190727228](https://gitee.com/testlyx/cloudimage/raw/master/img/image-20211206190727228.png)



##### b、修改realm

```java
package com.lvyx.shiro_boot02.shiro.realm;

import com.lvyx.shiro_boot02.entity.Permission;
import com.lvyx.shiro_boot02.entity.Role;
import com.lvyx.shiro_boot02.entity.User;
import com.lvyx.shiro_boot02.service.PermissionService;
import com.lvyx.shiro_boot02.service.RoleService;
import com.lvyx.shiro_boot02.service.UserService;
import org.apache.shiro.authc.AuthenticationException;
import org.apache.shiro.authc.AuthenticationInfo;
import org.apache.shiro.authc.AuthenticationToken;
import org.apache.shiro.authc.SimpleAuthenticationInfo;
import org.apache.shiro.authz.AuthorizationInfo;
import org.apache.shiro.authz.SimpleAuthorizationInfo;
import org.apache.shiro.realm.AuthorizingRealm;
import org.apache.shiro.subject.PrincipalCollection;
import org.apache.shiro.util.ByteSource;
import org.apache.shiro.util.CollectionUtils;
import org.springframework.stereotype.Component;

import javax.annotation.Resource;
import java.util.ArrayList;
import java.util.List;

/**
 * <p>
 * 自定义Realm
 * </p>
 *
 * @author lvyx
 * @since 2021-11-30 09:53:46
 */
@Component
public class MyRealm extends AuthorizingRealm {

    @Resource
    private UserService userService;

    @Resource
    private RoleService roleService;

    @Resource
    private PermissionService permissionService;

    /**
     * 授权
     * @param principalCollection  身份集合
     * @return org.apache.shiro.authz.AuthorizationInfo
     * @author lvyx
     * @since 2021/11/30 9:54
     **/
    @Override
    protected AuthorizationInfo doGetAuthorizationInfo(PrincipalCollection principalCollection) {
        // 用户名
        String username = (String) principalCollection.getPrimaryPrincipal();
        // 根据用户名的到用户的权限信息
        List<Role> roles = roleService.listRoleByUserName(username);
        if (!CollectionUtils.isEmpty(roles)){
            SimpleAuthorizationInfo simpleAuthorizationInfo = new SimpleAuthorizationInfo();
            // 角色名集合
            List<String> roleNames = new ArrayList<>();
            // 角色ids
            List<String> roleIds = new ArrayList<>();
            // 权限名集合
            List<String> permissionNames = new ArrayList<>();
            roles.forEach(role -> {
                roleNames.add(role.getRoleName());
                roleIds.add(role.getId());
            });
            // 根据角色ids得到权限信息
            List<Permission> permissions = permissionService.listByRoleIds(roleIds);
            if (! CollectionUtils.isEmpty(permissions)){
                permissions.forEach(permission -> {
                    permissionNames.add(permission.getName());
                });
            }
            // 添加用户角色信息
            simpleAuthorizationInfo.addRoles(roleNames);
            // 添加用户权限信息
            simpleAuthorizationInfo.addStringPermissions(permissionNames);
            return simpleAuthorizationInfo;
        }
        return null;
    }

    /**
     * 认证
     * @param authenticationToken 用于收集用户提交的身份（如用户名）及凭据（如密码）
     * @return org.apache.shiro.authc.AuthenticationInfo
     * @author lvyx
     * @since 2021/11/30 9:55
     **/
    @Override
    protected AuthenticationInfo doGetAuthenticationInfo(AuthenticationToken authenticationToken) throws AuthenticationException {
        String username = (String) authenticationToken.getPrincipal();
        // 根据用户名得到用户
        User byName = userService.getByName(username);
        if (byName != null) {
            /*
             * * 认证
             *   *  参数说明：用户名 | 加密后的密码 | 随机盐 | 当前realm的名字
             **/
            return new SimpleAuthenticationInfo(
                    byName.getUsername(),
                    byName.getPassword(),
                    ByteSource.Util.bytes(username),
                    this.getName());
        }
        return null;
    }
}
```



##### c、给需要授权的controller方法添加@RequiresPermissions注解

```java
/**
  * 查询用户信息
  * @return com.lvyx.shiro_boot02.vo.Result
  * @author lvyx
  * @since 2021/12/1 17:14
  **/
@LLogger(doc = "查询用户信息")
@RequestMapping("/listUser")
@RequiresRoles({"admin"})
@RequiresPermissions({"user:find:*"})
public Result listUser(){
    return Result.success(200, "查询用户成功",  userService.list());
}
```



## 4、SpringBoot整合Redis实现Shiro缓存

shiro提供了缓存管理器，这样在用户第一次认证授权后访问其受限资源的时候就不用每次查询数据库从而达到减轻数据压力的作用，但是shiro的这个缓存是本地缓存，也就是说当程序宕机重启后仍然需要从数据库加载数据，不能实现分布式缓存的功能。我们可以使用Redis进行缓存，用户登录以后用户的认证和授权数据已经缓存到redis了，这个时候即使程序重启，redis中的缓存数据也不会删除，除非用户自己退出登录。

### 4.1 导入依赖

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <groupId>com.lvyx</groupId>
    <artifactId>shiro_boot02</artifactId>
    <version>0.0.1-SNAPSHOT</version>
    <name>shiro_boot02</name>
    <description>shiro_boot02</description>

    <properties>
        <java.version>1.8</java.version>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        <project.reporting.outputEncoding>UTF-8</project.reporting.outputEncoding>
        <spring-boot.version>2.3.7.RELEASE</spring-boot.version>
        <hutool.version>5.7.16</hutool.version>
        <mybatis-plus-generator.verion>3.5.1</mybatis-plus-generator.verion>
        <velocity-engine-core.version>2.3</velocity-engine-core.version>
        <swagger.version>1.6.3</swagger.version>
        <mysql.version>8.0.25</mysql.version>
        <druid.version>1.2.8</druid.version>
        <mybatis-plus.version>3.4.3.4</mybatis-plus.version>
        <shiro.version>1.7.1</shiro.version>
    </properties>

    <dependencies>
        <!-- springBoot redis启动器 -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-redis</artifactId>
        </dependency>
        <!-- springBoot aop切面启动器-->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-aop</artifactId>
        </dependency>
        <!-- hutool工具包-->
        <dependency>
            <groupId>cn.hutool</groupId>
            <artifactId>hutool-all</artifactId>
            <version>${hutool.version}</version>
        </dependency>
        <!--代码生成器-->
        <dependency>
            <groupId>com.baomidou</groupId>
            <artifactId>mybatis-plus-generator</artifactId>
            <version>${mybatis-plus-generator.verion}</version>
        </dependency>
        <!--freemarker模板和velocity模板依赖，后面配置的时候会2选其1-->
        <dependency>
            <groupId>org.freemarker</groupId>
            <artifactId>freemarker</artifactId>
        </dependency>
        <dependency>
            <groupId>org.apache.velocity</groupId>
            <artifactId>velocity-engine-core</artifactId>
            <version>${velocity-engine-core.version}</version>
        </dependency>
        <!--swagger依赖-->
        <dependency>
            <groupId>io.swagger</groupId>
            <artifactId>swagger-annotations</artifactId>
            <version>${swagger.version}</version>
        </dependency>
        <dependency>
            <groupId>mysql</groupId>
            <artifactId>mysql-connector-java</artifactId>
            <version>${mysql.version}</version>
        </dependency>
        <!--数据连接池-->
        <dependency>
            <groupId>com.alibaba</groupId>
            <artifactId>druid</artifactId>
            <version>${druid.version}</version>
        </dependency>
        <!-- springBoot整合mybatis-plus-->
        <dependency>
            <groupId>com.baomidou</groupId>
            <artifactId>mybatis-plus-boot-starter</artifactId>
            <version>${mybatis-plus.version}</version>
        </dependency>
        <!-- shiro -->
        <dependency>
            <groupId>org.apache.shiro</groupId>
            <artifactId>shiro-spring-boot-starter</artifactId>
            <version>${shiro.version}</version>
        </dependency>
        <!-- spring web场景启动器 -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-devtools</artifactId>
            <scope>runtime</scope>
            <optional>true</optional>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
            <exclusions>
                <exclusion>
                    <groupId>org.junit.vintage</groupId>
                    <artifactId>junit-vintage-engine</artifactId>
                </exclusion>
            </exclusions>
        </dependency>
    </dependencies>

    <dependencyManagement>
        <dependencies>
            <dependency>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-dependencies</artifactId>
                <version>${spring-boot.version}</version>
                <type>pom</type>
                <scope>import</scope>
            </dependency>
        </dependencies>
    </dependencyManagement>

    <build>
        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-compiler-plugin</artifactId>
                <version>3.8.1</version>
                <configuration>
                    <source>1.8</source>
                    <target>1.8</target>
                    <encoding>UTF-8</encoding>
                </configuration>
            </plugin>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
                <version>2.3.7.RELEASE</version>
                <configuration>
                    <mainClass>com.lvyx.shiro_boot02.shiroBoot02Application</mainClass>
                </configuration>
                <executions>
                    <execution>
                        <id>repackage</id>
                        <goals>
                            <goal>repackage</goal>
                        </goals>
                    </execution>
                </executions>
            </plugin>
        </plugins>
    </build>

</project>
```



### 4.2 在yaml中加入redis的配置

```yaml
server:
  port: 8848
  servlet:
    context-path: /

spring:
  # 数据源
  datasource:
    url: jdbc:mysql://localhost:3306/test_shiro?useUnicode=true&characterEncoding=utf-8&useSSL=false&serverTimezone=GMT%2B8
    username: root
    password: root
    driver-class-name: com.mysql.cj.jdbc.Driver
    type: com.alibaba.druid.pool.DruidDataSource
  # redis配置
  redis:
    host: localhost
    port: 6379
    jedis:
      pool:
        max-idle: 8
        min-idle: 0
        max-active: 8
        max-wait: -1
    timeout: 0
    database: 0
# mybatis-plus配置
mybatis-plus:
  mapper-locations: classpath*:/mapper/**/*.xml
  configuration:
    # xml返回数据为map类型时，空值的key也要显示出来
    call-setters-on-nulls: true
    # 打印SQL日志
    log-impl: org.apache.ibatis.logging.stdout.StdOutImpl
  global-config:
    db-config:
      id-type: assign_uuid
      logic-delete-field: flag  # 全局逻辑删除的实体字段名(since 3.3.0,配置后可以忽略不配置)
      logic-delete-value: 1 # 逻辑已删除值(默认为 1)
      logic-not-delete-value: 0 # 逻辑未删除值(默认为 0)
```



### 4.3 编写相关工具类

#### 4.3.1 编写ApplicationContextUtils工具类方便的到Bean对象

```java
package com.lvyx.shiro_boot02.utils;

import org.springframework.beans.BeansException;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.stereotype.Component;

/**
 *
 * <P>
 * sping上下文工具
 * </P>
 *
 * @author lvyx
 * @since 2021/12/7 11:05
 **/
@Component
public class ApplicationContextUtils implements ApplicationContextAware {

    private static ApplicationContext context;

    @Override
    public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {
        context=applicationContext;
    }

    /**
     * 根据Bean的名称获取实例对象
     * @param beanName Bean的名称
     * @return java.lang.Object
     * @author lvyx
     * @since 2021/12/7 11:06
     **/
    public static Object getBean(String beanName){
        return context.getBean(beanName);
    }
}
```



#### 4.3.2 实现Shiro的Cache接口

```java
package com.lvyx.shiro_boot02.utils.cache;

import com.lvyx.shiro_boot02.utils.ApplicationContextUtils;
import org.apache.shiro.cache.Cache;
import org.apache.shiro.cache.CacheException;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.StringRedisSerializer;

import java.util.Collection;
import java.util.Set;

/**
 * <p>
 *    Shiro的Cache实现类 
 * </p>
 * 
 * @author lvyx
 * @since 2021/12/7 13:46
 **/
public class RedisCache<K,V> implements Cache<K,V> {
    private String cacheName;

    public RedisCache() {
    }

    public RedisCache(String cacheName) {
        this.cacheName = cacheName;
    }

    @Override
    public V get(K k) throws CacheException {
        System.out.println("获取缓存:"+ k);
        return (V) getRedisTemplate().opsForHash().get(this.cacheName,k.toString());
    }

    @Override
    public V put(K k, V v) throws CacheException {
        System.out.println("设置缓存key: "+k+" value:"+v);
        getRedisTemplate().opsForHash().put(this.cacheName,k.toString(),v);
        return null;
    }

    @Override
    public V remove(K k) throws CacheException {
        return (V) getRedisTemplate().opsForHash().delete(this.cacheName,k.toString());
    }

    @Override
    public void clear() throws CacheException {
        getRedisTemplate().delete(this.cacheName);
    }

    @Override
    public int size() {
        return getRedisTemplate().opsForHash().size(this.cacheName).intValue();
    }

    @Override
    public Set<K> keys() {
        return getRedisTemplate().opsForHash().keys(this.cacheName);
    }

    @Override
    public Collection<V> values() {
        return getRedisTemplate().opsForHash().values(this.cacheName);
    }

    private RedisTemplate getRedisTemplate(){
        RedisTemplate redisTemplate = (RedisTemplate) ApplicationContextUtils.getBean("redisTemplate");
        redisTemplate.setKeySerializer(new StringRedisSerializer());
        redisTemplate.setHashKeySerializer(new StringRedisSerializer());
        return redisTemplate;
    }
}
```



#### 4.3.3 自定义RedisCacheManger

```JAVA
package com.lvyx.shiro_boot02.utils.cache;

import org.apache.shiro.cache.Cache;
import org.apache.shiro.cache.CacheException;
import org.apache.shiro.cache.CacheManager;

/**
 * <p>
 *  redis缓存管理器
 * </p>
 *
 * @author lvyx
 * @since 2021/12/7 10:28
 **/
public class RedisCacheManager implements CacheManager {
    @Override
    public <K, V> Cache<K, V> getCache(String cacheName) throws CacheException {
        System.out.println("缓存名称: "+cacheName);
        return new RedisCache<>(cacheName);
    }
}
```



#### 4.3.4 自定义ByteSourceUtils

> 使用Shiro默认的ByteSource会导致序列化异常，需要自己重写

```java
package com.lvyx.shiro_boot02.utils;

import org.apache.shiro.codec.Base64;
import org.apache.shiro.codec.CodecSupport;
import org.apache.shiro.codec.Hex;
import org.apache.shiro.util.ByteSource;

import java.io.File;
import java.io.InputStream;
import java.io.Serializable;
import java.util.Arrays;

/**
 *
 * <p>
 *  自定义ByteSource工具类
 *      shiro官方的ByteSource未实现Serializable无法进行redis缓存
 * </p>
 *
 * @author lvyx
 * @since 2021/12/7 11:39
 **/
public class ByteSourceUtils implements ByteSource, Serializable {

    private byte[] bytes;
    private String cachedHex;
    private String cachedBase64;

    public ByteSourceUtils() {

    }

    public ByteSourceUtils(byte[] bytes) {
        this.bytes = bytes;
    }

    public ByteSourceUtils(char[] chars) {
        this.bytes = CodecSupport.toBytes(chars);
    }

    public ByteSourceUtils(String string) {
        this.bytes = CodecSupport.toBytes(string);
    }

    public ByteSourceUtils(ByteSource source) {
        this.bytes = source.getBytes();
    }

    public ByteSourceUtils(File file) {
        this.bytes = (new ByteSourceUtils.BytesHelper()).getBytes(file);
    }

    public ByteSourceUtils(InputStream stream) {
        this.bytes = (new ByteSourceUtils.BytesHelper()).getBytes(stream);
    }

    public static boolean isCompatible(Object o) {
        return o instanceof byte[] || o instanceof char[] || o instanceof String || o instanceof ByteSource || o instanceof File || o instanceof InputStream;
    }

    @Override
    public byte[] getBytes() {
        return this.bytes;
    }

    @Override
    public boolean isEmpty() {
        return this.bytes == null || this.bytes.length == 0;
    }

    @Override
    public String toHex() {
        if (this.cachedHex == null) {
            this.cachedHex = Hex.encodeToString(this.getBytes());
        }

        return this.cachedHex;
    }

    @Override
    public String toBase64() {
        if (this.cachedBase64 == null) {
            this.cachedBase64 = Base64.encodeToString(this.getBytes());
        }

        return this.cachedBase64;
    }

    @Override
    public String toString() {
        return this.toBase64();
    }

    @Override
    public int hashCode() {
        return this.bytes != null && this.bytes.length != 0 ? Arrays.hashCode(this.bytes) : 0;
    }

    @Override
    public boolean equals(Object o) {
        if (o == this) {
            return true;
        } else if (o instanceof ByteSource) {
            ByteSource bs = (ByteSource) o;
            return Arrays.equals(this.getBytes(), bs.getBytes());
        } else {
            return false;
        }
    }

    private static final class BytesHelper extends CodecSupport {
        private BytesHelper() {
        }

        public byte[] getBytes(File file) {
            return this.toBytes(file);
        }

        public byte[] getBytes(InputStream stream) {
            return this.toBytes(stream);
        }
    }
}
```



### 4.4 修改Shiro配置

```java
package com.lvyx.shiro_boot02.shiro.config;

import com.lvyx.shiro_boot02.utils.cache.RedisCacheManager;
import org.apache.shiro.authc.credential.HashedCredentialsMatcher;
import org.apache.shiro.realm.AuthorizingRealm;
import org.apache.shiro.spring.web.ShiroFilterFactoryBean;
import org.apache.shiro.web.mgt.DefaultWebSecurityManager;
import org.springframework.aop.framework.autoproxy.DefaultAdvisorAutoProxyCreator;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.HashMap;
import java.util.Map;

/**
 * <p>
 * shiro配置类
 * </p>
 *
 * @author lvyx
 * @since 2021-11-30 09:56:43
 */
@Configuration
public class ShiroConfig {

    /**
     * 解决shiro导致部分注解无法使用的问题
     * @return org.springframework.aop.framework.autoproxy.DefaultAdvisorAutoProxyCreator
     * @author lvyx
     * @since 2021/12/6 15:01
     **/
    @Bean
    public static DefaultAdvisorAutoProxyCreator getDefaultAdvisorAutoProxyCreator(){
        DefaultAdvisorAutoProxyCreator defaultAdvisorAutoProxyCreator=new DefaultAdvisorAutoProxyCreator();
        defaultAdvisorAutoProxyCreator.setUsePrefix(true);

        return defaultAdvisorAutoProxyCreator;
    }

    
    /**
     * 安全管理器
     * @param realm realm
     * @return org.apache.shiro.web.mgt.DefaultWebSecurityManager
     * @author lvyx
     * @since 2021/11/30 10:20
     **/
    @Bean
    public DefaultWebSecurityManager getDefaultWebSecurityManger(AuthorizingRealm realm){
        DefaultWebSecurityManager defaultWebSecurityManager = new DefaultWebSecurityManager();
        // 设置密码匹配器
        HashedCredentialsMatcher credentialsMatcher = new HashedCredentialsMatcher();
        // 设置加密方式
        credentialsMatcher.setHashAlgorithmName("MD5");
        // 设置散列次数
        credentialsMatcher.setHashIterations(1024);
        realm.setCredentialsMatcher(credentialsMatcher);

        // 设置缓存管理器
        realm.setCacheManager(new RedisCacheManager());
        // 开启全局缓存
        realm.setCachingEnabled(true);
        // 开启认证缓存并指定缓存名称
        realm.setAuthenticationCachingEnabled(true);
        realm.setAuthenticationCacheName("authenticationCache");
        // 开启授权缓存并指定缓存名称
        realm.setAuthorizationCachingEnabled(true);
        realm.setAuthorizationCacheName("authoricationCache");
        // 给安全管理器设置realm
        defaultWebSecurityManager.setRealm(realm);
        return defaultWebSecurityManager;
    }

    /**
     * shiroFilter负责拦截所有的请求
     * @param defaultWebSecurityManager 安全管理器
     * @return org.apache.shiro.spring.web.ShiroFilterFactoryBean
     * @author lvyx
     * @since 2021/11/30 10:26
     **/
    @Bean
    public ShiroFilterFactoryBean getShiroFilterFactioryBean(DefaultWebSecurityManager defaultWebSecurityManager){
        ShiroFilterFactoryBean shiroFilterFactoryBean = new ShiroFilterFactoryBean();

        // 给filter设置安全管理器
        shiroFilterFactoryBean.setSecurityManager(defaultWebSecurityManager);

        // 配置系统受限资源
        // 配置系统公共资源
        Map<String, String> map = new HashMap<>();
        // 放行的公共资源
        map.put("/user/login", "anon");
        map.put("/error/**", "anon");
        // 所有请求都需要认证和授权
        map.put("/**", "authc");

        // 默认认证的请求
        shiroFilterFactoryBean.setLoginUrl("/login.html");
        shiroFilterFactoryBean.setUnauthorizedUrl("/error/noAuthor");
        shiroFilterFactoryBean.setFilterChainDefinitionMap(map);

        return shiroFilterFactoryBean;
    }
}
```

