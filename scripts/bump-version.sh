function get_root() {
    dir="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
    root="$( dirname "$dir" )"
    printf %s $root
}

function get_package_json_file() {
    printf %s "$( get_root )/package.json"
}

function get_module_json_file() {
    printf %s "$( get_root )/module.json"
}

function get_version_file() {
    root="$( get_root )"
    printf %s "$root/VERSION"
}

function get_version() {
    version_file="$( get_version_file )"
    version="$( cat "$version_file" )"
    printf %s "$version"
}

function propagate_package_json() {
    version="$( get_version )"
    sed -i -r "s/^(\s*\"version\": \")[0-9\.]+(\",{0,1})$/\1$version\2/" "$( get_package_json_file )"
}

function propagate_module_json() {
    version="$( get_version )"
    sed -i -r "s/^(\s*\"version\": \")[0-9\.]+(\",{0,1})$/\1$version\2/" "$( get_module_json_file )"
}

function set_version() {
    new_version=$1
    root="$( get_root )"
    echo "$new_version" > "$root/VERSION"
}

function get_tag() {
    tag="$( git describe --tags `git rev-list --tags --max-count=1` 2>/dev/null )"
    printf %s $tag
}

function get_new_version() {
    version="$1"
    tag="$2"
    if [ -z "$tag" ]
    then
        log=$(git log --pretty=oneline)
    else
        log=$(git log $tag..HEAD --pretty=oneline)
    fi
    case "$log" in
        *#major* ) new=$(semver bump major $version);;
        *#minor* ) new=$(semver bump minor $version);;
        *#patch* ) new=$(semver bump patch $version);;
        * ) exit 1;;
    esac
    printf %s $new
}

function bump_version_file() {
    version="$( get_version )"
    echo "got version '${version}'"
    tag="$( get_tag )"
    echo "got tag '${tag}'"
    new_version="$( get_new_version "$version" "$tag" )"
    if [ "$?" -eq 1 ]
    then
        echo 'failed to get new version, check commit messages'
        exit 1
    fi
    echo "got new version '${new_version}'"
    set_version $new_version
}

function init() {
    version_file="$( get_version_file )"
    if [ ! -f "$version_file" ]
    then
        set_version '0.0.0'
    fi
}

run() {
    init
    bump_version_file
    propagate_package_json
    propagate_module_json
}

run
