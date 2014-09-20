/*
 * Copyright © 2014 Cask Data, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */

package co.cask.cdap.security.authentication.client.basic;

import org.jboss.netty.handler.codec.http.HttpResponseStatus;
import org.junit.Test;

import javax.ws.rs.BadRequestException;
import javax.ws.rs.ForbiddenException;
import javax.ws.rs.InternalServerErrorException;
import javax.ws.rs.NotAllowedException;
import javax.ws.rs.NotAuthorizedException;
import javax.ws.rs.NotFoundException;
import javax.ws.rs.NotSupportedException;

public class RestClientUtilsTest {
  @Test
  public void testOkResponseCodeAnalysis() {
    RestClientUtils.verifyResponseCode(HttpResponseStatus.OK.getCode(), "OK");
  }

  @Test(expected = BadRequestException.class)
  public void testBadRequestResponseCodeAnalysis() {
    RestClientUtils.verifyResponseCode(HttpResponseStatus.BAD_REQUEST.getCode(), "Bad Request");
  }

  @Test(expected = NotFoundException.class)
  public void testNotFoundResponseCodeAnalysis() {
    RestClientUtils.verifyResponseCode(HttpResponseStatus.NOT_FOUND.getCode(), "Not Found");
  }

  @Test(expected = NotAuthorizedException.class)
  public void testUnauthorizedResponseCodeAnalysis() {
    RestClientUtils.verifyResponseCode(HttpResponseStatus.UNAUTHORIZED.getCode(), "Unauthorized");
  }

  @Test(expected = ForbiddenException.class)
  public void testForbiddenResponseCodeAnalysis() {
    RestClientUtils.verifyResponseCode(HttpResponseStatus.FORBIDDEN.getCode(),"Forbidden");
  }

  @Test(expected = NotAllowedException.class)
  public void testNotAllowedResponseCodeAnalysis() {
    RestClientUtils.verifyResponseCode(HttpResponseStatus.METHOD_NOT_ALLOWED.getCode(),"Method Not Allowed");
  }

  @Test(expected = BadRequestException.class)
  public void testConflictResponseCodeAnalysis() {
    RestClientUtils.verifyResponseCode(HttpResponseStatus.CONFLICT.getCode(), "Conflict");
  }

  @Test(expected = InternalServerErrorException.class)
  public void testInternalServerErrorResponseCodeAnalysis() {
    RestClientUtils.verifyResponseCode(HttpResponseStatus.INTERNAL_SERVER_ERROR.getCode(), "Internal Server Error");
  }

  @Test(expected = NotSupportedException.class)
  public void testNotImplementedResponseCodeAnalysis() {
    RestClientUtils.verifyResponseCode(HttpResponseStatus.NOT_IMPLEMENTED.getCode(), "Not Implemented");
  }
}
