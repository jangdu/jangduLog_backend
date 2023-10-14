export default {
  smtp: {
    host: 'smtp.gmail.com',
    port: 465, // SSL을 사용하는 경우 465, TLS를 사용하는 경우 587
    secure: true, // true for 465, false for other ports
    auth: {
      user: 'jjd0324@gmail.com', // 발신자 이메일 주소
      pass: '!272422janG', // 발신자 이메일 비밀번호 또는 앱 비밀번호 (보안을 위해 환경 변수 등으로 관리하는 것이 좋음)
    },
  },
};
