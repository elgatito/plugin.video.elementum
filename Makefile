NAME = plugin.video.elementum
GIT = git
GIT_VERSION = $(shell $(GIT) describe --always)
GIT_USER = elgatito
GIT_REPOSITORY = plugin.video.elementum
VERSION = $(shell sed -ne "s/.*version=\"\([0-9a-z\.\-]*\)\"\sprovider.*/\1/p" addon.xml)
ARCHS = \
	android_arm \
	android_arm64 \
	android_x86 \
	android_x64 \
	darwin_x64 \
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

all: clean zip

.PHONY: $(ARCHS)

$(ARCHS):
	$(MAKE) clean_arch ZIP_SUFFIX=$@.zip
	$(MAKE) zip ARCHS=$@ ZIP_SUFFIX=$@.zip

$(ZIP_FILE):
	echo "Zipping $(ZIP_FILE)"
	git archive --format zip --prefix $(NAME)/ --output $(ZIP_FILE) HEAD

	mkdir -p $(NAME)/resources/site-packages
	cp -r `pwd`/$(DEV)/resources/site-packages/platform_detect $(NAME)/resources/site-packages
	zip -9 -r -g $(ZIP_FILE) $(NAME)/resources/site-packages/platform_detect

	mkdir -p $(NAME)/resources/bin
	for arch in $(ARCHS); do \
		cp -r `pwd`/$(DEV)/resources/bin/$$arch $(NAME)/resources/bin/$$arch; \
		echo "v$(VERSION)" >> $(NAME)/resources/bin/$$arch/version; \
		zip -9 -r -g $(ZIP_FILE) $(NAME)/resources/bin/$$arch; \
	done
	rm -rf $(NAME)

zip: $(ZIP_FILE)

zipfiles: addon.xml
	echo "Zipping all platforms"
	for arch in $(ARCHS); do \
		$(MAKE) $$arch; \
	done

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
	rm -rf $(NAME)

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

