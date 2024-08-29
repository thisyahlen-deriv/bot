import classNames from 'classnames';
import { observer } from 'mobx-react-lite';
import DesktopWrapper from '@/components/shared_ui/desktop-wrapper';
import MobileWrapper from '@/components/shared_ui/mobile-wrapper';
import { DBOT_TABS } from '@/constants/bot-contents';
import { useStore } from '@/hooks/useStore';
import { LegacyClose1pxIcon } from '@deriv/quill-icons';
import { Modal, Text } from '@deriv-com/ui';
import { SIDEBAR_INTRO } from './constants';

const InfoPanel = observer(() => {
    const { dashboard } = useStore();
    const {
        active_tour,
        is_info_panel_visible,
        setActiveTab,
        setActiveTabTutorial,
        setInfoPanelVisibility,
        setFaqTitle,
    } = dashboard;
    const switchTab = (link: boolean, label: string, faq_id: string) => {
        const tutorial_link = link ? setActiveTab(DBOT_TABS.TUTORIAL) : null;
        const tutorial_label = label === 'Guide' ? setActiveTabTutorial(0) : setActiveTabTutorial(1);
        setFaqTitle(faq_id);
        return {
            tutorial_link,
            tutorial_label,
        };
    };

    const handleClose = () => {
        setInfoPanelVisibility(false);
        localStorage.setItem('dbot_should_show_info', JSON.stringify(Date.now()));
    };

    const renderInfo = () => (
        <div className='db-info-panel'>
            <div data-testid='close-icon' className='db-info-panel__close-action' onClick={handleClose}>
                <LegacyClose1pxIcon height='18px' width='18px' />
            </div>

            {SIDEBAR_INTRO.map(sidebar_item => {
                const { label, content, link } = sidebar_item;
                return (
                    <div key={`${label}-${content}`}>
                        <Text color='prominent' lineHeight='6xl' size='lg' weight='bold' as='h1'>
                            {label}
                        </Text>
                        {content.map(text => (
                            <Text
                                key={`info-panel-tour${text.data}`}
                                className={classNames('db-info-panel__card', {
                                    'db-info-panel__content': link,
                                })}
                                color='prominent'
                                lineHeight='3xl'
                                as='p'
                                onClick={() => switchTab(link, label, text.faq_id)}
                                size='sm'
                            >
                                {text.data}
                            </Text>
                        ))}
                    </div>
                );
            })}
        </div>
    );

    return (
        <>
            <DesktopWrapper>
                {!active_tour && (
                    <div
                        className={classNames('tab__dashboard__info-panel', {
                            'tab__dashboard__info-panel--active': is_info_panel_visible,
                        })}
                    >
                        {renderInfo()}
                    </div>
                )}
            </DesktopWrapper>
            <MobileWrapper>
                <Modal
                    className='statistics__modal statistics__modal--mobile'
                    is_open={is_info_panel_visible}
                    toggleModal={handleClose}
                    width={'440px'}
                >
                    <Modal.Body>{renderInfo()}</Modal.Body>
                </Modal>
            </MobileWrapper>
        </>
    );
});

export default InfoPanel;
