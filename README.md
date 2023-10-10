# JangduLog

### **개인 블로그 프로젝트 (2023 3월 ~ (진행중))**

개발 잘하시는 분들이 운영하시는 개인 블로그에 대한 동경으로 시작한 개인블로그 프로젝트

- URL: [https://blog.jangdu.site](https://blog.jangdu.site/)
- Github 주소
  - backend : [https://github.com/jangdu/jangduLog_backend](https://github.com/jangdu/jangduLog_backend)
  - frontend : [https://github.com/jangdu/jangduLog_frontend](https://github.com/jangdu/jangduLog_frontend)
- RestAPI 문서 : [https://jangdu.site/api/docs](https://jangdu.site/api/docs)

### **주요 기술**

- typescript, nest.js, React.js, MySQL,
- tailwindCSS
- AWS : EC2, S3, CloudFront, CodeDeploy
- Redis

### **아키텍쳐 패턴**

![Untitled](https://res.cloudinary.com/dyhnnmhcf/image/upload/v1695778101/BlogProject_un6zix.png)

### **주요 구현 내용**

Swagger **:** frontend와의 소통을 위해서 dto, nest-swagger를 사용한 [**문서 작성 자동화**](https://jangdu.site/api/docs)

React를 활용한 프론트엔드 구현

- CloudFront, S3, EC2, RDS를 사용한 배포
  - 반복적인 빌드, 배포의 불편을 느껴 \***\*CodeDeploy를 사용한 **[배포 자동화를 통해 효율적인 개발 환경 구성](https://blog.jangdu.site/posts/7)\*\*
  - 빌드하는 과정 중 문제 발생 시, 배포를 하지않고 중단하도록 구현, 추후 테스트코드 추가 예정

Nest.js, MySQL을 사용한 백엔드 구현

- Firebase를 통한 간단한 DB구축 후, N**est.js로 마이그레이션 백엔드 구현 진행중(2023.09 ~)**
  - 태그 기능을 구현하며 데이터 무결성 및 [트랜잭션 관리와 확장성에 용이한 RDBMS의 필요성](https://github.com/jangdu/jangduLog_backend/blob/f4c6682a23b41800f12aad85699274dc529b092e/src/posts/posts.repository.ts#L64C20-L64C20)을 느껴서 MySQL선택

### tag기능

![](https://res.cloudinary.com/dyhnnmhcf/image/upload/v1696658091/%E1%84%87%E1%85%B3%E1%86%AF%E1%84%85%E1%85%A9%E1%84%80%E1%85%B3%E1%84%90%E1%85%A2%E1%84%80%E1%85%B3_fn7rlt.gif)
