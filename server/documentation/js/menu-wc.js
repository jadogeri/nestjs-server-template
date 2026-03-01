'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">server documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                                <li class="link">
                                    <a href="overview.html" data-type="chapter-link">
                                        <span class="icon ion-ios-keypad"></span>Overview
                                    </a>
                                </li>

                            <li class="link">
                                <a href="index.html" data-type="chapter-link">
                                    <span class="icon ion-ios-paper"></span>
                                        README
                                </a>
                            </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                                <li class="link">
                                    <a href="properties.html" data-type="chapter-link">
                                        <span class="icon ion-ios-apps"></span>Properties
                                    </a>
                                </li>

                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-bs-toggle="collapse" ${ isNormalMode ?
                                'data-bs-target="#modules-links"' : 'data-bs-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AccessControlModule.html" data-type="entity-link" >AccessControlModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link" >AppModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/AuthModule.html" data-type="entity-link" >AuthModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-AuthModule-dd3c7d106257e90ff2dc23262d685ea76c0744ee15938448677dc4f0c0ac0ee5a210e8a74bc7cb9c0c396c82ccaa5bf5cfe1c258d1aaa3431cfe49e23c268dc9"' : 'data-bs-target="#xs-controllers-links-module-AuthModule-dd3c7d106257e90ff2dc23262d685ea76c0744ee15938448677dc4f0c0ac0ee5a210e8a74bc7cb9c0c396c82ccaa5bf5cfe1c258d1aaa3431cfe49e23c268dc9"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AuthModule-dd3c7d106257e90ff2dc23262d685ea76c0744ee15938448677dc4f0c0ac0ee5a210e8a74bc7cb9c0c396c82ccaa5bf5cfe1c258d1aaa3431cfe49e23c268dc9"' :
                                            'id="xs-controllers-links-module-AuthModule-dd3c7d106257e90ff2dc23262d685ea76c0744ee15938448677dc4f0c0ac0ee5a210e8a74bc7cb9c0c396c82ccaa5bf5cfe1c258d1aaa3431cfe49e23c268dc9"' }>
                                            <li class="link">
                                                <a href="controllers/AuthController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuthController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-AuthModule-dd3c7d106257e90ff2dc23262d685ea76c0744ee15938448677dc4f0c0ac0ee5a210e8a74bc7cb9c0c396c82ccaa5bf5cfe1c258d1aaa3431cfe49e23c268dc9"' : 'data-bs-target="#xs-injectables-links-module-AuthModule-dd3c7d106257e90ff2dc23262d685ea76c0744ee15938448677dc4f0c0ac0ee5a210e8a74bc7cb9c0c396c82ccaa5bf5cfe1c258d1aaa3431cfe49e23c268dc9"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AuthModule-dd3c7d106257e90ff2dc23262d685ea76c0744ee15938448677dc4f0c0ac0ee5a210e8a74bc7cb9c0c396c82ccaa5bf5cfe1c258d1aaa3431cfe49e23c268dc9"' :
                                        'id="xs-injectables-links-module-AuthModule-dd3c7d106257e90ff2dc23262d685ea76c0744ee15938448677dc4f0c0ac0ee5a210e8a74bc7cb9c0c396c82ccaa5bf5cfe1c258d1aaa3431cfe49e23c268dc9"' }>
                                        <li class="link">
                                            <a href="injectables/AccessTokenStrategy.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AccessTokenStrategy</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/AuthRepository.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuthRepository</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/CookieService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CookieService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/LocalStrategy.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >LocalStrategy</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/RefreshTokenStrategy.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RefreshTokenStrategy</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/ContactModule.html" data-type="entity-link" >ContactModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-ContactModule-f736002fd94277ad0da87bfc43915e29b950787003b43173b0611645129d120ec7be2a12c9c0557e50ac5112b1fb367ecb41e6e90a0014a497f39250c2828292"' : 'data-bs-target="#xs-controllers-links-module-ContactModule-f736002fd94277ad0da87bfc43915e29b950787003b43173b0611645129d120ec7be2a12c9c0557e50ac5112b1fb367ecb41e6e90a0014a497f39250c2828292"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-ContactModule-f736002fd94277ad0da87bfc43915e29b950787003b43173b0611645129d120ec7be2a12c9c0557e50ac5112b1fb367ecb41e6e90a0014a497f39250c2828292"' :
                                            'id="xs-controllers-links-module-ContactModule-f736002fd94277ad0da87bfc43915e29b950787003b43173b0611645129d120ec7be2a12c9c0557e50ac5112b1fb367ecb41e6e90a0014a497f39250c2828292"' }>
                                            <li class="link">
                                                <a href="controllers/ContactController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ContactController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-ContactModule-f736002fd94277ad0da87bfc43915e29b950787003b43173b0611645129d120ec7be2a12c9c0557e50ac5112b1fb367ecb41e6e90a0014a497f39250c2828292"' : 'data-bs-target="#xs-injectables-links-module-ContactModule-f736002fd94277ad0da87bfc43915e29b950787003b43173b0611645129d120ec7be2a12c9c0557e50ac5112b1fb367ecb41e6e90a0014a497f39250c2828292"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-ContactModule-f736002fd94277ad0da87bfc43915e29b950787003b43173b0611645129d120ec7be2a12c9c0557e50ac5112b1fb367ecb41e6e90a0014a497f39250c2828292"' :
                                        'id="xs-injectables-links-module-ContactModule-f736002fd94277ad0da87bfc43915e29b950787003b43173b0611645129d120ec7be2a12c9c0557e50ac5112b1fb367ecb41e6e90a0014a497f39250c2828292"' }>
                                        <li class="link">
                                            <a href="injectables/ContactRepository.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ContactRepository</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/ContactService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ContactService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/CookieModule.html" data-type="entity-link" >CookieModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-CookieModule-f2cc9044ffd575f25df0e68d221310818ab8fb9988a9a88441eecc172f3a76fcd91f1ea2bbeeda04dc1aae410ffc90931292096243c57901e321509cae142c53"' : 'data-bs-target="#xs-injectables-links-module-CookieModule-f2cc9044ffd575f25df0e68d221310818ab8fb9988a9a88441eecc172f3a76fcd91f1ea2bbeeda04dc1aae410ffc90931292096243c57901e321509cae142c53"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-CookieModule-f2cc9044ffd575f25df0e68d221310818ab8fb9988a9a88441eecc172f3a76fcd91f1ea2bbeeda04dc1aae410ffc90931292096243c57901e321509cae142c53"' :
                                        'id="xs-injectables-links-module-CookieModule-f2cc9044ffd575f25df0e68d221310818ab8fb9988a9a88441eecc172f3a76fcd91f1ea2bbeeda04dc1aae410ffc90931292096243c57901e321509cae142c53"' }>
                                        <li class="link">
                                            <a href="injectables/CookieService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CookieService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/CoreModule.html" data-type="entity-link" >CoreModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/GreetingModule.html" data-type="entity-link" >GreetingModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-GreetingModule-4771a1c942d364461dd85cc6395a40082c483004821a242c44f7b0dc0432ecf3f864a15400ac90cd6d07be9dc2f38bd41bb9297ef6387d80b378bc662f4d4bb4"' : 'data-bs-target="#xs-injectables-links-module-GreetingModule-4771a1c942d364461dd85cc6395a40082c483004821a242c44f7b0dc0432ecf3f864a15400ac90cd6d07be9dc2f38bd41bb9297ef6387d80b378bc662f4d4bb4"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-GreetingModule-4771a1c942d364461dd85cc6395a40082c483004821a242c44f7b0dc0432ecf3f864a15400ac90cd6d07be9dc2f38bd41bb9297ef6387d80b378bc662f4d4bb4"' :
                                        'id="xs-injectables-links-module-GreetingModule-4771a1c942d364461dd85cc6395a40082c483004821a242c44f7b0dc0432ecf3f864a15400ac90cd6d07be9dc2f38bd41bb9297ef6387d80b378bc662f4d4bb4"' }>
                                        <li class="link">
                                            <a href="injectables/GreetingService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >GreetingService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/HashingModule.html" data-type="entity-link" >HashingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/HealthModule.html" data-type="entity-link" >HealthModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-HealthModule-c70d527c04e5afd43b32cd660a005b048a05c3309223d6faeaffc3d7ed2f213a661a7ab0685056c1db13d151904d08a296a557a7466f167e628166f88f40eda0"' : 'data-bs-target="#xs-controllers-links-module-HealthModule-c70d527c04e5afd43b32cd660a005b048a05c3309223d6faeaffc3d7ed2f213a661a7ab0685056c1db13d151904d08a296a557a7466f167e628166f88f40eda0"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-HealthModule-c70d527c04e5afd43b32cd660a005b048a05c3309223d6faeaffc3d7ed2f213a661a7ab0685056c1db13d151904d08a296a557a7466f167e628166f88f40eda0"' :
                                            'id="xs-controllers-links-module-HealthModule-c70d527c04e5afd43b32cd660a005b048a05c3309223d6faeaffc3d7ed2f213a661a7ab0685056c1db13d151904d08a296a557a7466f167e628166f88f40eda0"' }>
                                            <li class="link">
                                                <a href="controllers/HealthController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >HealthController</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/InfrastructureModule.html" data-type="entity-link" >InfrastructureModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/MailModule.html" data-type="entity-link" >MailModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/PermissionModule.html" data-type="entity-link" >PermissionModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-PermissionModule-e0807e45612a277f14c55d995cbd6b41158415821b93cbca0f144b6ef022177a792ee579042734fa3f74db9564fc0b54f4d2b3166793f4beca8933225c1915b6"' : 'data-bs-target="#xs-controllers-links-module-PermissionModule-e0807e45612a277f14c55d995cbd6b41158415821b93cbca0f144b6ef022177a792ee579042734fa3f74db9564fc0b54f4d2b3166793f4beca8933225c1915b6"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-PermissionModule-e0807e45612a277f14c55d995cbd6b41158415821b93cbca0f144b6ef022177a792ee579042734fa3f74db9564fc0b54f4d2b3166793f4beca8933225c1915b6"' :
                                            'id="xs-controllers-links-module-PermissionModule-e0807e45612a277f14c55d995cbd6b41158415821b93cbca0f144b6ef022177a792ee579042734fa3f74db9564fc0b54f4d2b3166793f4beca8933225c1915b6"' }>
                                            <li class="link">
                                                <a href="controllers/PermissionController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PermissionController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-PermissionModule-e0807e45612a277f14c55d995cbd6b41158415821b93cbca0f144b6ef022177a792ee579042734fa3f74db9564fc0b54f4d2b3166793f4beca8933225c1915b6"' : 'data-bs-target="#xs-injectables-links-module-PermissionModule-e0807e45612a277f14c55d995cbd6b41158415821b93cbca0f144b6ef022177a792ee579042734fa3f74db9564fc0b54f4d2b3166793f4beca8933225c1915b6"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-PermissionModule-e0807e45612a277f14c55d995cbd6b41158415821b93cbca0f144b6ef022177a792ee579042734fa3f74db9564fc0b54f4d2b3166793f4beca8933225c1915b6"' :
                                        'id="xs-injectables-links-module-PermissionModule-e0807e45612a277f14c55d995cbd6b41158415821b93cbca0f144b6ef022177a792ee579042734fa3f74db9564fc0b54f4d2b3166793f4beca8933225c1915b6"' }>
                                        <li class="link">
                                            <a href="injectables/PermissionRepository.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PermissionRepository</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/PermissionService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PermissionService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/ProfileModule.html" data-type="entity-link" >ProfileModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-ProfileModule-6ab84bb8ce8476d2b67e3ac3f7674aa785360a176be5c590e0857ecf181694941832072841e8d366dafe75b74e4ddf714480ca514bc7f33f282adc04dc539c51"' : 'data-bs-target="#xs-controllers-links-module-ProfileModule-6ab84bb8ce8476d2b67e3ac3f7674aa785360a176be5c590e0857ecf181694941832072841e8d366dafe75b74e4ddf714480ca514bc7f33f282adc04dc539c51"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-ProfileModule-6ab84bb8ce8476d2b67e3ac3f7674aa785360a176be5c590e0857ecf181694941832072841e8d366dafe75b74e4ddf714480ca514bc7f33f282adc04dc539c51"' :
                                            'id="xs-controllers-links-module-ProfileModule-6ab84bb8ce8476d2b67e3ac3f7674aa785360a176be5c590e0857ecf181694941832072841e8d366dafe75b74e4ddf714480ca514bc7f33f282adc04dc539c51"' }>
                                            <li class="link">
                                                <a href="controllers/ProfileController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ProfileController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-ProfileModule-6ab84bb8ce8476d2b67e3ac3f7674aa785360a176be5c590e0857ecf181694941832072841e8d366dafe75b74e4ddf714480ca514bc7f33f282adc04dc539c51"' : 'data-bs-target="#xs-injectables-links-module-ProfileModule-6ab84bb8ce8476d2b67e3ac3f7674aa785360a176be5c590e0857ecf181694941832072841e8d366dafe75b74e4ddf714480ca514bc7f33f282adc04dc539c51"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-ProfileModule-6ab84bb8ce8476d2b67e3ac3f7674aa785360a176be5c590e0857ecf181694941832072841e8d366dafe75b74e4ddf714480ca514bc7f33f282adc04dc539c51"' :
                                        'id="xs-injectables-links-module-ProfileModule-6ab84bb8ce8476d2b67e3ac3f7674aa785360a176be5c590e0857ecf181694941832072841e8d366dafe75b74e4ddf714480ca514bc7f33f282adc04dc539c51"' }>
                                        <li class="link">
                                            <a href="injectables/ProfileRepository.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ProfileRepository</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/ProfileService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ProfileService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/RoleModule.html" data-type="entity-link" >RoleModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-RoleModule-dcd0237cf987a92cf4aeeb15b5b79412261f20473ebbd213ac2e4f45c0b4d169d98379028b6951126f29c8322f0ddc00cc9f6eac1b8303c62255b87e7c68ce41"' : 'data-bs-target="#xs-controllers-links-module-RoleModule-dcd0237cf987a92cf4aeeb15b5b79412261f20473ebbd213ac2e4f45c0b4d169d98379028b6951126f29c8322f0ddc00cc9f6eac1b8303c62255b87e7c68ce41"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-RoleModule-dcd0237cf987a92cf4aeeb15b5b79412261f20473ebbd213ac2e4f45c0b4d169d98379028b6951126f29c8322f0ddc00cc9f6eac1b8303c62255b87e7c68ce41"' :
                                            'id="xs-controllers-links-module-RoleModule-dcd0237cf987a92cf4aeeb15b5b79412261f20473ebbd213ac2e4f45c0b4d169d98379028b6951126f29c8322f0ddc00cc9f6eac1b8303c62255b87e7c68ce41"' }>
                                            <li class="link">
                                                <a href="controllers/RoleController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RoleController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-RoleModule-dcd0237cf987a92cf4aeeb15b5b79412261f20473ebbd213ac2e4f45c0b4d169d98379028b6951126f29c8322f0ddc00cc9f6eac1b8303c62255b87e7c68ce41"' : 'data-bs-target="#xs-injectables-links-module-RoleModule-dcd0237cf987a92cf4aeeb15b5b79412261f20473ebbd213ac2e4f45c0b4d169d98379028b6951126f29c8322f0ddc00cc9f6eac1b8303c62255b87e7c68ce41"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-RoleModule-dcd0237cf987a92cf4aeeb15b5b79412261f20473ebbd213ac2e4f45c0b4d169d98379028b6951126f29c8322f0ddc00cc9f6eac1b8303c62255b87e7c68ce41"' :
                                        'id="xs-injectables-links-module-RoleModule-dcd0237cf987a92cf4aeeb15b5b79412261f20473ebbd213ac2e4f45c0b4d169d98379028b6951126f29c8322f0ddc00cc9f6eac1b8303c62255b87e7c68ce41"' }>
                                        <li class="link">
                                            <a href="injectables/RoleRepository.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RoleRepository</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/RoleService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RoleService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/SecurityModule.html" data-type="entity-link" >SecurityModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/SessionCleanupModule.html" data-type="entity-link" >SessionCleanupModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-SessionCleanupModule-e50897bde4a88d56b8f4b1f1d69b746c5cf7953470fa8f3eeff4bf69e383006888741b7b3d7b9b3ae76e00e0544fdfbc2232a2eb87c47c370bddf127fb746de2"' : 'data-bs-target="#xs-injectables-links-module-SessionCleanupModule-e50897bde4a88d56b8f4b1f1d69b746c5cf7953470fa8f3eeff4bf69e383006888741b7b3d7b9b3ae76e00e0544fdfbc2232a2eb87c47c370bddf127fb746de2"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-SessionCleanupModule-e50897bde4a88d56b8f4b1f1d69b746c5cf7953470fa8f3eeff4bf69e383006888741b7b3d7b9b3ae76e00e0544fdfbc2232a2eb87c47c370bddf127fb746de2"' :
                                        'id="xs-injectables-links-module-SessionCleanupModule-e50897bde4a88d56b8f4b1f1d69b746c5cf7953470fa8f3eeff4bf69e383006888741b7b3d7b9b3ae76e00e0544fdfbc2232a2eb87c47c370bddf127fb746de2"' }>
                                        <li class="link">
                                            <a href="injectables/SessionCleanupService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SessionCleanupService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/SessionModule.html" data-type="entity-link" >SessionModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-SessionModule-d13cdcdb6a60e7cf92d21782604920d104b4b8d7fe89db27c3dc544a131485921b6a0ace7a3ae4a20bef268b2ef0608860e4acdbbf7e332f635fef1d1185759d"' : 'data-bs-target="#xs-controllers-links-module-SessionModule-d13cdcdb6a60e7cf92d21782604920d104b4b8d7fe89db27c3dc544a131485921b6a0ace7a3ae4a20bef268b2ef0608860e4acdbbf7e332f635fef1d1185759d"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-SessionModule-d13cdcdb6a60e7cf92d21782604920d104b4b8d7fe89db27c3dc544a131485921b6a0ace7a3ae4a20bef268b2ef0608860e4acdbbf7e332f635fef1d1185759d"' :
                                            'id="xs-controllers-links-module-SessionModule-d13cdcdb6a60e7cf92d21782604920d104b4b8d7fe89db27c3dc544a131485921b6a0ace7a3ae4a20bef268b2ef0608860e4acdbbf7e332f635fef1d1185759d"' }>
                                            <li class="link">
                                                <a href="controllers/SessionController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SessionController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-SessionModule-d13cdcdb6a60e7cf92d21782604920d104b4b8d7fe89db27c3dc544a131485921b6a0ace7a3ae4a20bef268b2ef0608860e4acdbbf7e332f635fef1d1185759d"' : 'data-bs-target="#xs-injectables-links-module-SessionModule-d13cdcdb6a60e7cf92d21782604920d104b4b8d7fe89db27c3dc544a131485921b6a0ace7a3ae4a20bef268b2ef0608860e4acdbbf7e332f635fef1d1185759d"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-SessionModule-d13cdcdb6a60e7cf92d21782604920d104b4b8d7fe89db27c3dc544a131485921b6a0ace7a3ae4a20bef268b2ef0608860e4acdbbf7e332f635fef1d1185759d"' :
                                        'id="xs-injectables-links-module-SessionModule-d13cdcdb6a60e7cf92d21782604920d104b4b8d7fe89db27c3dc544a131485921b6a0ace7a3ae4a20bef268b2ef0608860e4acdbbf7e332f635fef1d1185759d"' }>
                                        <li class="link">
                                            <a href="injectables/SessionRepository.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SessionRepository</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/SessionService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SessionService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/TokenModule.html" data-type="entity-link" >TokenModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/UserModule.html" data-type="entity-link" >UserModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-UserModule-92bb78272531954c4ea38802acb4eb35fa717e86545e50d9392d07e504b2f9f862a2c00ceeef517029781b204419fe29c27ee11c37e276280a614bf21fbd673a"' : 'data-bs-target="#xs-controllers-links-module-UserModule-92bb78272531954c4ea38802acb4eb35fa717e86545e50d9392d07e504b2f9f862a2c00ceeef517029781b204419fe29c27ee11c37e276280a614bf21fbd673a"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-UserModule-92bb78272531954c4ea38802acb4eb35fa717e86545e50d9392d07e504b2f9f862a2c00ceeef517029781b204419fe29c27ee11c37e276280a614bf21fbd673a"' :
                                            'id="xs-controllers-links-module-UserModule-92bb78272531954c4ea38802acb4eb35fa717e86545e50d9392d07e504b2f9f862a2c00ceeef517029781b204419fe29c27ee11c37e276280a614bf21fbd673a"' }>
                                            <li class="link">
                                                <a href="controllers/UserController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UserController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-UserModule-92bb78272531954c4ea38802acb4eb35fa717e86545e50d9392d07e504b2f9f862a2c00ceeef517029781b204419fe29c27ee11c37e276280a614bf21fbd673a"' : 'data-bs-target="#xs-injectables-links-module-UserModule-92bb78272531954c4ea38802acb4eb35fa717e86545e50d9392d07e504b2f9f862a2c00ceeef517029781b204419fe29c27ee11c37e276280a614bf21fbd673a"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-UserModule-92bb78272531954c4ea38802acb4eb35fa717e86545e50d9392d07e504b2f9f862a2c00ceeef517029781b204419fe29c27ee11c37e276280a614bf21fbd673a"' :
                                        'id="xs-injectables-links-module-UserModule-92bb78272531954c4ea38802acb4eb35fa717e86545e50d9392d07e504b2f9f862a2c00ceeef517029781b204419fe29c27ee11c37e276280a614bf21fbd673a"' }>
                                        <li class="link">
                                            <a href="injectables/UserRepository.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UserRepository</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/UserService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UserService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                </ul>
                </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#controllers-links"' :
                                'data-bs-target="#xs-controllers-links"' }>
                                <span class="icon ion-md-swap"></span>
                                <span>Controllers</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="controllers-links"' : 'id="xs-controllers-links"' }>
                                <li class="link">
                                    <a href="controllers/AuthController.html" data-type="entity-link" >AuthController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/ContactController.html" data-type="entity-link" >ContactController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/HealthController.html" data-type="entity-link" >HealthController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/PermissionController.html" data-type="entity-link" >PermissionController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/ProfileController.html" data-type="entity-link" >ProfileController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/RoleController.html" data-type="entity-link" >RoleController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/SessionController.html" data-type="entity-link" >SessionController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/UserController.html" data-type="entity-link" >UserController</a>
                                </li>
                            </ul>
                        </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#entities-links"' :
                                'data-bs-target="#xs-entities-links"' }>
                                <span class="icon ion-ios-apps"></span>
                                <span>Entities</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="entities-links"' : 'id="xs-entities-links"' }>
                                <li class="link">
                                    <a href="entities/Auth.html" data-type="entity-link" >Auth</a>
                                </li>
                                <li class="link">
                                    <a href="entities/Contact.html" data-type="entity-link" >Contact</a>
                                </li>
                                <li class="link">
                                    <a href="entities/Permission.html" data-type="entity-link" >Permission</a>
                                </li>
                                <li class="link">
                                    <a href="entities/Profile.html" data-type="entity-link" >Profile</a>
                                </li>
                                <li class="link">
                                    <a href="entities/Role.html" data-type="entity-link" >Role</a>
                                </li>
                                <li class="link">
                                    <a href="entities/Session.html" data-type="entity-link" >Session</a>
                                </li>
                                <li class="link">
                                    <a href="entities/User.html" data-type="entity-link" >User</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#classes-links"' :
                            'data-bs-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/AccessAuthGuard.html" data-type="entity-link" >AccessAuthGuard</a>
                            </li>
                            <li class="link">
                                <a href="classes/AccessControlService.html" data-type="entity-link" >AccessControlService</a>
                            </li>
                            <li class="link">
                                <a href="classes/AccountManagementService.html" data-type="entity-link" >AccountManagementService</a>
                            </li>
                            <li class="link">
                                <a href="classes/AccountManagementServiceInterface.html" data-type="entity-link" >AccountManagementServiceInterface</a>
                            </li>
                            <li class="link">
                                <a href="classes/Argon2Service.html" data-type="entity-link" >Argon2Service</a>
                            </li>
                            <li class="link">
                                <a href="classes/Audit.html" data-type="entity-link" >Audit</a>
                            </li>
                            <li class="link">
                                <a href="classes/AuthenticationEventListener.html" data-type="entity-link" >AuthenticationEventListener</a>
                            </li>
                            <li class="link">
                                <a href="classes/AuthGeneratorUtil.html" data-type="entity-link" >AuthGeneratorUtil</a>
                            </li>
                            <li class="link">
                                <a href="classes/AuthNotFoundException.html" data-type="entity-link" >AuthNotFoundException</a>
                            </li>
                            <li class="link">
                                <a href="classes/AuthService.html" data-type="entity-link" >AuthService</a>
                            </li>
                            <li class="link">
                                <a href="classes/BaseRepository.html" data-type="entity-link" >BaseRepository</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateAuthDto.html" data-type="entity-link" >CreateAuthDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateContactDto.html" data-type="entity-link" >CreateContactDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreatePermissionDto.html" data-type="entity-link" >CreatePermissionDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateProfileDto.html" data-type="entity-link" >CreateProfileDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateRoleDto.html" data-type="entity-link" >CreateRoleDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateSchema1234567890000.html" data-type="entity-link" >CreateSchema1234567890000</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateSessionDto.html" data-type="entity-link" >CreateSessionDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateUserDto.html" data-type="entity-link" >CreateUserDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CredentialService.html" data-type="entity-link" >CredentialService</a>
                            </li>
                            <li class="link">
                                <a href="classes/CredentialServiceInterface.html" data-type="entity-link" >CredentialServiceInterface</a>
                            </li>
                            <li class="link">
                                <a href="classes/DatabaseExceptionFilter.html" data-type="entity-link" >DatabaseExceptionFilter</a>
                            </li>
                            <li class="link">
                                <a href="classes/ForgotPasswordDto.html" data-type="entity-link" >ForgotPasswordDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/GreetingsEventListener.html" data-type="entity-link" >GreetingsEventListener</a>
                            </li>
                            <li class="link">
                                <a href="classes/HashingService.html" data-type="entity-link" >HashingService</a>
                            </li>
                            <li class="link">
                                <a href="classes/IdentityService.html" data-type="entity-link" >IdentityService</a>
                            </li>
                            <li class="link">
                                <a href="classes/IdentityServiceInterface.html" data-type="entity-link" >IdentityServiceInterface</a>
                            </li>
                            <li class="link">
                                <a href="classes/IsFaxNumberConstraint.html" data-type="entity-link" >IsFaxNumberConstraint</a>
                            </li>
                            <li class="link">
                                <a href="classes/IsPhoneNumberConstraint.html" data-type="entity-link" >IsPhoneNumberConstraint</a>
                            </li>
                            <li class="link">
                                <a href="classes/IsPostalCodeByCountryConstraint.html" data-type="entity-link" >IsPostalCodeByCountryConstraint</a>
                            </li>
                            <li class="link">
                                <a href="classes/LoadDatabase1234567890001.html" data-type="entity-link" >LoadDatabase1234567890001</a>
                            </li>
                            <li class="link">
                                <a href="classes/LocalAuthGuard.html" data-type="entity-link" >LocalAuthGuard</a>
                            </li>
                            <li class="link">
                                <a href="classes/Location.html" data-type="entity-link" >Location</a>
                            </li>
                            <li class="link">
                                <a href="classes/LoginDto.html" data-type="entity-link" >LoginDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/MailService.html" data-type="entity-link" >MailService</a>
                            </li>
                            <li class="link">
                                <a href="classes/MatchConstraint.html" data-type="entity-link" >MatchConstraint</a>
                            </li>
                            <li class="link">
                                <a href="classes/PasswordGeneratorUtil.html" data-type="entity-link" >PasswordGeneratorUtil</a>
                            </li>
                            <li class="link">
                                <a href="classes/PasswordManagementEventListener.html" data-type="entity-link" >PasswordManagementEventListener</a>
                            </li>
                            <li class="link">
                                <a href="classes/PasswordManagementService.html" data-type="entity-link" >PasswordManagementService</a>
                            </li>
                            <li class="link">
                                <a href="classes/PasswordManagementServiceInterface.html" data-type="entity-link" >PasswordManagementServiceInterface</a>
                            </li>
                            <li class="link">
                                <a href="classes/PayloadMapperService.html" data-type="entity-link" >PayloadMapperService</a>
                            </li>
                            <li class="link">
                                <a href="classes/Permission.html" data-type="entity-link" >Permission</a>
                            </li>
                            <li class="link">
                                <a href="classes/PermissionStringGeneratorUtil.html" data-type="entity-link" >PermissionStringGeneratorUtil</a>
                            </li>
                            <li class="link">
                                <a href="classes/ProfileGeneratorUtil.html" data-type="entity-link" >ProfileGeneratorUtil</a>
                            </li>
                            <li class="link">
                                <a href="classes/RefreshAuthGuard.html" data-type="entity-link" >RefreshAuthGuard</a>
                            </li>
                            <li class="link">
                                <a href="classes/RegisterDto.html" data-type="entity-link" >RegisterDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/RegistrationEventListener.html" data-type="entity-link" >RegistrationEventListener</a>
                            </li>
                            <li class="link">
                                <a href="classes/RegistrationService.html" data-type="entity-link" >RegistrationService</a>
                            </li>
                            <li class="link">
                                <a href="classes/RegistrationServiceInterface.html" data-type="entity-link" >RegistrationServiceInterface</a>
                            </li>
                            <li class="link">
                                <a href="classes/ResendVerificationEmailDto.html" data-type="entity-link" >ResendVerificationEmailDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/ResetPasswordDto.html" data-type="entity-link" >ResetPasswordDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/RoleNotFoundException.html" data-type="entity-link" >RoleNotFoundException</a>
                            </li>
                            <li class="link">
                                <a href="classes/Server.html" data-type="entity-link" >Server</a>
                            </li>
                            <li class="link">
                                <a href="classes/TokenService.html" data-type="entity-link" >TokenService</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateAuthDto.html" data-type="entity-link" >UpdateAuthDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateContactDto.html" data-type="entity-link" >UpdateContactDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdatePermissionDto.html" data-type="entity-link" >UpdatePermissionDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateProfileDto.html" data-type="entity-link" >UpdateProfileDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateRoleDto.html" data-type="entity-link" >UpdateRoleDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateSessionDto.html" data-type="entity-link" >UpdateSessionDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateUserDto.html" data-type="entity-link" >UpdateUserDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UserGeneratorUtil.html" data-type="entity-link" >UserGeneratorUtil</a>
                            </li>
                            <li class="link">
                                <a href="classes/UserNotFoundException.html" data-type="entity-link" >UserNotFoundException</a>
                            </li>
                            <li class="link">
                                <a href="classes/UserSeeder.html" data-type="entity-link" >UserSeeder</a>
                            </li>
                            <li class="link">
                                <a href="classes/UserSubscriber.html" data-type="entity-link" >UserSubscriber</a>
                            </li>
                            <li class="link">
                                <a href="classes/VerifyEmailDto.html" data-type="entity-link" >VerifyEmailDto</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#injectables-links"' :
                                'data-bs-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/AccessTokenStrategy.html" data-type="entity-link" >AccessTokenStrategy</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AuthRepository.html" data-type="entity-link" >AuthRepository</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ContactRepository.html" data-type="entity-link" >ContactRepository</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ContactService.html" data-type="entity-link" >ContactService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/CookieService.html" data-type="entity-link" >CookieService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/GreetingService.html" data-type="entity-link" >GreetingService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/LocalStrategy.html" data-type="entity-link" >LocalStrategy</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/PaginationInterceptor.html" data-type="entity-link" >PaginationInterceptor</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/PermissionRepository.html" data-type="entity-link" >PermissionRepository</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/PermissionService.html" data-type="entity-link" >PermissionService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ProfileRepository.html" data-type="entity-link" >ProfileRepository</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ProfileService.html" data-type="entity-link" >ProfileService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/RefreshTokenStrategy.html" data-type="entity-link" >RefreshTokenStrategy</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/RoleRepository.html" data-type="entity-link" >RoleRepository</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/RoleService.html" data-type="entity-link" >RoleService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SessionCleanupService.html" data-type="entity-link" >SessionCleanupService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SessionRepository.html" data-type="entity-link" >SessionRepository</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SessionService.html" data-type="entity-link" >SessionService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/TypeOrmPinoLogger.html" data-type="entity-link" >TypeOrmPinoLogger</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/UserRepository.html" data-type="entity-link" >UserRepository</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/UserService.html" data-type="entity-link" >UserService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#guards-links"' :
                            'data-bs-target="#xs-guards-links"' }>
                            <span class="icon ion-ios-lock"></span>
                            <span>Guards</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="guards-links"' : 'id="xs-guards-links"' }>
                            <li class="link">
                                <a href="guards/PermissionsGuard.html" data-type="entity-link" >PermissionsGuard</a>
                            </li>
                            <li class="link">
                                <a href="guards/RolesGuard.html" data-type="entity-link" >RolesGuard</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#interfaces-links"' :
                            'data-bs-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/AccountLockedEmailContext.html" data-type="entity-link" >AccountLockedEmailContext</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/AnniversaryEmailContext.html" data-type="entity-link" >AnniversaryEmailContext</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/AuthenticationEventListenerInterface.html" data-type="entity-link" >AuthenticationEventListenerInterface</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/AuthRepositoryInterface.html" data-type="entity-link" >AuthRepositoryInterface</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/BaseEmailContext.html" data-type="entity-link" >BaseEmailContext</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/BirthdayEmailContext.html" data-type="entity-link" >BirthdayEmailContext</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/CustomAuthRepositoryMethodsInterface.html" data-type="entity-link" >CustomAuthRepositoryMethodsInterface</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/CustomSSessionRepositoryMethodsInterface.html" data-type="entity-link" >CustomSSessionRepositoryMethodsInterface</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/CustomUserRepositoryMethodsInterface.html" data-type="entity-link" >CustomUserRepositoryMethodsInterface</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/GreetingsEventListenerInterface.html" data-type="entity-link" >GreetingsEventListenerInterface</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/JwtPayloadInterface.html" data-type="entity-link" >JwtPayloadInterface</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/LocationInterface.html" data-type="entity-link" >LocationInterface</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/PasswordForgotEmailContext.html" data-type="entity-link" >PasswordForgotEmailContext</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/PasswordManagementEventListenerInterface.html" data-type="entity-link" >PasswordManagementEventListenerInterface</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/PasswordResetEmailContext.html" data-type="entity-link" >PasswordResetEmailContext</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ProfilePayload.html" data-type="entity-link" >ProfilePayload</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/RegistrationEventListenerInterface.html" data-type="entity-link" >RegistrationEventListenerInterface</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SessionRepositoryInterface.html" data-type="entity-link" >SessionRepositoryInterface</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/UserPayload.html" data-type="entity-link" >UserPayload</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/UserRepositoryInterface.html" data-type="entity-link" >UserRepositoryInterface</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/VerificationEmailContext.html" data-type="entity-link" >VerificationEmailContext</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/WelcomeEmailContext.html" data-type="entity-link" >WelcomeEmailContext</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#pipes-links"' :
                                'data-bs-target="#xs-pipes-links"' }>
                                <span class="icon ion-md-add"></span>
                                <span>Pipes</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="pipes-links"' : 'id="xs-pipes-links"' }>
                                <li class="link">
                                    <a href="pipes/EmailValidationPipe.html" data-type="entity-link" >EmailValidationPipe</a>
                                </li>
                                <li class="link">
                                    <a href="pipes/TokenValidationPipe.html" data-type="entity-link" >TokenValidationPipe</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#miscellaneous-links"'
                            : 'data-bs-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/enumerations.html" data-type="entity-link">Enums</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/typealiases.html" data-type="entity-link">Type aliases</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <a data-type="chapter-link" href="routes.html"><span class="icon ion-ios-git-branch"></span>Routes</a>
                        </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank" rel="noopener noreferrer">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});