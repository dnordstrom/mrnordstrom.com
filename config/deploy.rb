##
# Application
##
set :application, "mrnordstrom.com"
set :repository,  "ssh://dnordstrom@niroot.com/var/www/git/mrnordstrom.com.git"

##
# Servers
##
role :web, "niroot.com"
role :app, "niroot.com"
role :db,  "niroot.com", :primary => true

##
# Deployment settings
##
set :user,          "root"
set :scm,           :git
set :branch,        'master'
set :deploy_via,    'remote_cache'
set :use_sudo,      false

##
# Paths
##
set :deploy_to,     "/var/www/vhosts/mrnordstrom.com"

namespace :deploy do
  task :start do ; end
  task :stop do ; end
  task :restart, :roles => :app, :except => { :no_release => true } do
    run "rm -rf #{deploy_to}/shared/_site && mkdir #{deploy_to}/shared/_site && ln -nfs #{shared_path}/_site #{release_path}/_site"
    run "cd #{release_path} && jekyll"
  end
  
  task :set_permissions, :roles => :app do
    run "chown -R apache #{deploy_to}/releases"
    run "chown -R apache #{deploy_to}/httpdocs"
    run "chown -R apache #{deploy_to}/shared/_site"
  end
  
  task :create_tags, :roles => :app do
    run "cd #{release_path} && rake tags"
  end
end

after "deploy:finalize_update", "deploy:create_tags"
after "deploy:finalize_update", "deploy:restart"
after "deploy:finalize_update", "deploy:set_permissions"