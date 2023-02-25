export class SignInResponseDto {
  /**
   * Id
   * @example 1
   */
  userId: number;

  /**
   * Access token
   * @example "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjQsImVtYWlsIjoiZW1haWxAZXhhbXBsZS5jb20iLCJpYXQiOjE2NzIxNjY5NDMsImV4cCI6MTY3MjE2NzI0MywiYXVkIjoibG9jYWxob3N0OjMwMDAiLCJpc3MiOiJsb2NhbGhvc3Q6MzAwMCJ9.eB5j8y5yWVSB6Tka33UdAIJDX2gm6AHLHGSVdbHCDuU"
   */
  accessToken: string;

  /**
   * Special token that is used to obtain additional access tokens
   * @example "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjMsInJlZnJlc2hUb2tlbklkIjoiMjE1YWVhNmQtMmU3MC00YzM4LWJiNmItYjkxNmIxZDZmZWFmIiwiaWF0IjoxNjcyMDgyMzYwLCJleHAiOjE2NzIxNjg3NjAsImF1ZCI6ImxvY2FsaG9zdDozMDAwIiwiaXNzIjoibG9jYWxob3N0OjMwMDAifQ.r0sgjmDNSIiOYLzPkU6I2zqmjgl5d7ti_bvS2mYrtBA"
   */
  refreshToken: string;
}
