# -*- coding: utf-8 -*-
# Copyright © 2014 Cask Data, Inc.
#
# Licensed under the Apache License, Version 2.0 (the "License"); you may not
# use this file except in compliance with the License. You may obtain a copy of
# the License at
#
# http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
# WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
# License for the specific language governing permissions and limitations under
# the License.

import abc
import six


@six.add_metaclass(abc.ABCMeta)
class AuthenticationClient(object):

    @abc.abstractmethod
    def configure(self, host, port, ssl):
        return

    @abc.abstractmethod
    def get_access_token(self, credentials):
        return

    @abc.abstractmethod
    def is_auth_enabled(self):
        return

    @abc.abstractmethod
    def set_connection_info(self, host, port, ssl):
        return

    @abc.abstractmethod
    def get_required_credentials(self):
        return

    @abc.abstractmethod
    def is_auth_enabled(self):
        return

    @abc.abstractmethod
    def fetch_access_token(self):
        return

    @abc.abstractmethod
    def invalidate_token(self):
        return