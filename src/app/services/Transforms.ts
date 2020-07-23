export const firebaseUserResultTransformer = (result) => {
  return {
    error: false,
    displayName: result.user.displayName,
    emailVerified: result.user.emailVerified,
    email: result.user.email,
    fullName: result.user.displayName.split('##')[0],
    nickName: result.user.displayName.split('##')[1],
  };
};
