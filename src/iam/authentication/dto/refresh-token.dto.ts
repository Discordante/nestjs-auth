import { IsJWT } from 'class-validator';

export class RefreshTokenDto {
  /**
   * Special token that is used to obtain additional access tokens
   * @example "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjMsInJlZnJlc2hUb2tlbklkIjoiMjE1YWVhNmQtMmU3MC00YzM4LWJiNmItYjkxNmIxZDZmZWFmIiwiaWF0IjoxNjcyMDgyMzYwLCJleHAiOjE2NzIxNjg3NjAsImF1ZCI6ImxvY2FsaG9zdDozMDAwIiwiaXNzIjoibG9jYWxob3N0OjMwMDAifQ.r0sgjmDNSIiOYLzPkU6I2zqmjgl5d7ti_bvS2mYrtBA"
   */
  @IsJWT()
  refreshToken: string;
}
