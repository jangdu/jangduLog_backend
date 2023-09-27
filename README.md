# JangduLog

### **개인 블로그 프로젝트 (2023 3월 ~ (진행중))**

개발 잘하시는 분들이 운영하시는 개인 블로그에 대한 동경으로 시작한 개인블로그 프로젝트

- URL: [https://blog.jangdu.site](https://blog.jangdu.site/)
- Github 주소 : [https://github.com/Drinkit-project](https://github.com/Drinkit-project)
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

- ReactJS, firebase를 사용해서 프론트엔드 구현( 2023.03 )
- **firebase -> nest.js**
  - firebase를 사용해 간단한 DB를 구축했지만,
    이후 데이터관리 및 기능 추가 시 불편한 문제 발생
    **->** **nest.js, mysql(typeorm)로 백엔드 구현 ( 2023.09 ~ )**
- CloudFront, S3, EC2, RDS를 사용한 배포
  - 반복적인 빌드, 배포의 불편
    **->** CodeDeploy를 사용해 **CI/CD** **배포 자동화를 통해 효율적인 개발 환경 구성** ([https://blog.jangdu.site/posts/7](https://blog.jangdu.site/posts/7))
- **Redis :** 가장 조회가 많이 일어나는 첫 페이지를 캐싱해 응답속도 개선 **( 240ms -> 92ms )**
- LoggerMiddleware를 사용해 api 모니터링
- nestjs/swagger를 사용해 편리한 API문서 작성 ([https://jangdu.site/api/docs](https://jangdu.site/api/docs))
