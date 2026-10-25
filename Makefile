NAME = plugin.video.elementum
GIT = git
GIT_VERSION = $(shell $(GIT) describe --always)
GIT_USER = elgatito
GIT_REPOSITORY = plugin.video.elementum
VERSION = $(shell sed -ne "s/.*version=\"\([0-9a-z\.+\-]*\)\"\sprovider.*/\1/p" addon.xml)
ARCHS = \
	android_arm \
	android_arm64 \
	android_x86 \
	android_x64 \
	darwin_x64 \
	darwin_arm64 \
	linux_armv6 \
	linux_armv7 \
	linux_armv7_softfp \
	linux_arm64 \
	linux_x64 \
	linux_x86 \
	windows_x64 \
	windows_x86 \
	client
ZIP_SUFFIX = zip
ZIP_FILE = $(NAME)-$(VERSION).$(ZIP_SUFFIX)
# Per-zip staging dir, so per-arch zips can be built in parallel
STAGE = .stage-$(ZIP_SUFFIX)
# Parallel per-arch zips (`make JOBS=1 zipfiles` for one at a time)
JOBS ?= 4

all: clean zip

.PHONY: $(ARCHS)

$(ARCHS):
	$(MAKE) clean_arch ZIP_SUFFIX=$@.zip
	$(MAKE) zip ARCHS=$@ ZIP_SUFFIX=$@.zip

$(ZIP_FILE):
	echo "Zipping $(ZIP_FILE)"
	git archive --format zip --prefix $(NAME)/ --output $(ZIP_FILE) HEAD

	mkdir -p $(STAGE)/$(NAME)/resources/site-packages
	cp -r `pwd`/$(DEV)/resources/site-packages/platform_detect $(STAGE)/$(NAME)/resources/site-packages
	cd $(STAGE) && zip -9 -r -x .git -x ".git/*" -g ../$(ZIP_FILE) $(NAME)/resources/site-packages/platform_detect

	mkdir -p $(STAGE)/$(NAME)/resources/bin
	for arch in $(ARCHS); do \
		cp -r `pwd`/$(DEV)/resources/bin/$$arch $(STAGE)/$(NAME)/resources/bin/$$arch; \
		echo "v$(VERSION)" >> $(STAGE)/$(NAME)/resources/bin/$$arch/version; \
		(cd $(STAGE) && zip -9 -r -x .git -x ".git/*" -g ../$(ZIP_FILE) $(NAME)/resources/bin/$$arch); \
	done
	rm -rf $(STAGE)

zip: $(ZIP_FILE)

zipfiles: addon.xml
	echo "Zipping all platforms"
	$(MAKE) -j$(JOBS) --output-sync=target $(ARCHS)

upload:
	echo "Uploading zip files"
	$(eval EXISTS := $(shell github-release info --user $(GIT_USER) --repo $(GIT_REPOSITORY) --tag v$(VERSION) 1>&2 2>/dev/null; echo $$?))
ifneq ($(EXISTS),1)
	github-release release \
		--user $(GIT_USER) \
		--repo $(GIT_REPOSITORY) \
		--tag v$(VERSION) \
		--name "$(VERSION)" \
		--description "$(VERSION)"
endif

	sleep 5
	for arch in $(ARCHS); do \
		github-release upload \
			--user $(GIT_USER) \
			--repo $(GIT_REPOSITORY) \
			--replace \
			--tag v$(VERSION) \
			--file $(NAME)-$(VERSION).$$arch.zip \
			--name $(NAME)-$(VERSION).$$arch.zip; \
	done

	github-release upload \
		--user $(GIT_USER) \
		--repo $(GIT_REPOSITORY) \
		--replace \
		--tag v$(VERSION) \
		--file $(NAME)-$(VERSION).zip \
		--name $(NAME)-$(VERSION).zip

clean_arch:
	 rm -f $(ZIP_FILE)

clean:
	for arch in $(ARCHS); do \
		$(MAKE) clean_arch ZIP_SUFFIX=$$arch.zip; \
	done
	rm -f $(ZIP_FILE)
	rm -rf $(NAME) .stage-*

deps:
	echo "Downloading platform_detect"
	rm -rf `pwd`/$(DEV)/resources/site-packages/platform_detect
	mkdir -p `pwd`/$(DEV)/resources/site-packages

	wget https://github.com/ElementumOrg/platform_detect/archive/master.zip && \
	unzip master.zip && \
	cp -rf platform_detect-master/python `pwd`/$(DEV)/resources/site-packages/platform_detect && \
	cp -rf platform_detect-master/libraries `pwd`/$(DEV)/resources/site-packages/platform_detect/ && \
	rm -rf platform_detect-master && \
	rm master.zip

locales:
	scripts/xgettext_merge.sh
	scripts/xgettext.sh