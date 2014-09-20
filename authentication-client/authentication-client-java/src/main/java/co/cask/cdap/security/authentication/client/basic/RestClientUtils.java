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

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.ws.rs.BadRequestException;
import javax.ws.rs.ForbiddenException;
import javax.ws.rs.InternalServerErrorException;
import javax.ws.rs.NotAllowedException;
import javax.ws.rs.NotAuthorizedException;
import javax.ws.rs.NotFoundException;
import javax.ws.rs.NotSupportedException;

/**
 * The utility class for working with rest clients.
 */
public final class RestClientUtils {
  private static final Logger LOG = LoggerFactory.getLogger(RestClientUtils.class);

  private RestClientUtils() {
  }

  /**
   * Utility method for analysis HTTP response status code and throw appropriate Java API Exception.
   *
   * @param code HTTP response code
   * @param message HTTP response message
   */
  public static void verifyResponseCode(int code, String message) {
    switch (code) {
      case 200:
        LOG.debug("Success operation result code.");
        break;
      case 404:
        throw new NotFoundException("Not found HTTP code was received from gateway server.");
      case 409:
        throw new BadRequestException("Conflict HTTP code was received from gateway server.");
      case 400:
        throw new BadRequestException("Bad request HTTP code was received from gateway server.");
      case 401:
        throw new NotAuthorizedException(message);
      case 403:
        throw new ForbiddenException("Forbidden HTTP code was received from gateway server");
      case 405:
        throw new NotAllowedException(message);
      case 500:
        throw new InternalServerErrorException("Internal server exception during operation process.");
      case 501:
      default:
        throw new NotSupportedException("Operation is not supported by gateway server");
    }
  }
}
