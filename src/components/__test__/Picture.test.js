import React from 'react';
import { shallow } from 'enzyme';
import Picture from '../Picture';

describe('Component: Picture snapshot', () => {
    it('should render Picture ', () => {
        const wrapper = shallow(<Picture author="" imgSrc="" />);

        expect(wrapper).toMatchSnapshot();
    });
});

describe('Picture component', () => {
    const wrapper = shallow(<Picture author="Autor" imgSrc="src" />);

    const author = wrapper.find("h3");
    const image = wrapper.find("img");

    test('Picture has author', () => {
        expect(author.exists()).toBeTruthy();
    });

    test('Picture has image', () => {
        expect(image.exists()).toBeTruthy();
    });
});
