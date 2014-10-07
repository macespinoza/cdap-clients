
module AuthenticationClient

  class AuthenticationClientInterface

    def configure properties
      raise 'this method should be overriden'
    end

    def get_access_token
      raise 'this method should be overriden'
    end

    def auth_enabled?
      raise 'this method should be overriden'
    end

    def invalidate_token
      raise 'this method should be overriden'
    end

    def set_connection_info host, port, ssl
      raise 'this method should be overriden'
    end

    def get_required_credentials
      raise 'this method should be overriden'
    end
  end
end