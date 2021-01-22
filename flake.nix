{
  description = "A FoundryVTT module to support the other lawful modules";

  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";

  inputs.flake-utils.url = "github:numtide/flake-utils";

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (
      system:
      let
        pkgs =
          import nixpkgs {
            inherit system;
            overlays = [
              (import ./nix/overlay.nix)
            ];
          };

        inherit (pkgs) stdenv;

        name = "lawful-core";

      in
      rec {
        overlay = import ./nix/overlay.nix;

        packages = { };

        devShell =
          let
            env = "dev";

          in
          with pkgs;
          mkShell {
            NODE_ENV = if env == "prod" then "production" else "development";
            LOCALE_ARCHIVE_2_27 = "${pkgs.glibcLocales}/lib/locale/locale-archive";
            LOCALE_ARCHIVE_2_11 = "${pkgs.glibcLocales}/lib/locale/locale-archive";
            LANG = "en_US.UTF-8";
            ENV = "${name}-${env}";

            buildInputs = with pkgs; [
              fd
              sd
              git
              bat
              yarn
              nodejs
              httpie
              nushell
              go-task
              semver-tool
              glibcLocales
            ];

            shellHook = ''
              export NIX_PATH=${pkgs.path}:nixpkgs=${pkgs.path}:.
            '';
          };
      }
    );
}
