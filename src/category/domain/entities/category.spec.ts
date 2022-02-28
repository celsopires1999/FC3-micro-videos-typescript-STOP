import Category, { CategoryProperties } from './category';
import { omit } from 'lodash';
import { validate as uuidValidate } from 'uuid';

describe("Category Unit Test", () => {
    test('constructor of category', () => {
        let category = new Category({
            name: 'Movie',
        });
        let props = omit(category.props, 'created_at');
        expect(category.name).toBe('Movie');
        expect(category.description).toBeNull();
        expect(category.is_active).toBeTruthy();
        expect(category.created_at).toBeInstanceOf(Date);
        expect(category.props.created_at).toBeInstanceOf(Date);
        expect(props).toStrictEqual({
            name: 'Movie',
            description: null,
            is_active: true,
        });



        let created_at = new Date();
        category = new Category({
            name: 'Movie',
            description: 'some description',
            is_active: false,
            created_at
        });
        expect(category.name).toBe('Movie');
        expect(category.description).toBe('some description');
        expect(category.is_active).toBeFalsy();
        expect(category.created_at).toBe(created_at);
        expect(category.props).toStrictEqual({
            name: 'Movie',
            description: 'some description',
            is_active: false,
            created_at
        });



        category = new Category({
            name: 'Movie',
            description: 'other description',
        });
        expect(category.props).toMatchObject({
            name: 'Movie',
            description: 'other description',
        });



        category = new Category({
            name: 'Movie',
            is_active: true,
        });
        expect(category.props).toMatchObject({
            name: 'Movie',
            is_active: true,
        });



        created_at = new Date();
        category = new Category({
            name: 'Movie',
            created_at,
        });
        expect(category.props).toMatchObject({
            name: 'Movie',
            created_at,
        });
    });

    test('id prop', () => {
        type CategoryData = {
            props: CategoryProperties, id?: string,
        }
        const data: CategoryData[] = [
            { props: { name: 'Movie' } },
            { props: { name: 'Movie' }, id: null },
            { props: { name: 'Movie' }, id: undefined },
            { props: { name: 'Movie' }, id: '2091311b-16b1-4356-9d40-edc0b1d56874' },
        ];
        data.forEach(i => {
            const category = new Category(i.props, i.id);
            expect(category.id).not.toBeNull();
            expect(uuidValidate(category.id)).toBeTruthy
        });
    })

    test('getter of name prop', () => {
        const category = new Category({ name: 'Movie' });
        expect(category.name).toBe('Movie');
    })

    test('getter and setter of description prop', () => {
        let categorie = new Category({
            name: 'Movie',
        });
        expect(categorie.description).toBeNull();

        categorie = new Category({
            name: 'Movie',
            description: 'some description'
        });
        expect(categorie.description).toBe('some description');

        categorie = new Category({
            name: 'Movie',
        });
        categorie['description'] = 'other description';
        expect(categorie.description).toBe('other description');

        categorie['description'] = undefined;
        expect(categorie.description).toBeNull;

        categorie['description'] = null;
        expect(categorie.description).toBeNull;
    });

    test('getter and setter of is_active prop', () => {
        let category = new Category({
            name: 'Movie'
        });
        expect(category.is_active).toBeTruthy();

        category = new Category({
            name: 'Movie',
            is_active: true
        });
        expect(category.is_active).toBeTruthy();

        category = new Category({
            name: 'Movie',
            is_active: false
        });
        expect(category.is_active).toBeFalsy();

        category['is_active'] = false;
        expect(category.is_active).toBeFalsy();

        category['is_active'] = true;
        expect(category.is_active).toBeTruthy();

        category['is_active'] = undefined;
        expect(category.is_active).toBeTruthy();

        category['is_active'] = null;
        expect(category.is_active).toBeTruthy();
    });

    test('setter of created_at prop', () => {
        const created_at = new Date();
        let category = new Category({
            name: 'Movie',
            created_at
        });
        expect(category.created_at).toBe(created_at);

        category = new Category({
            name: 'Movie'
        });
        expect(category.created_at).toBeInstanceOf(Date);

    });
});
