import { v4 as uuidv4 } from 'uuid';

export interface CategoryProperties {
    name: string,
    description?: string,
    is_active?: boolean,
    created_at?: Date,
}

export default class Category {
    public readonly id: string;
    constructor(public readonly props: CategoryProperties, id?: string) {
        this.id = id || uuidv4();
        this.description = this.props.description;
        this.is_active = this.props.is_active;
        this.props.created_at = this.props.created_at ?? new Date();
    }
    get name(): string {
        return this.props.name
    }
    get description(): string {
        return this.props.description
    }
    private set description(value: string) {
        this.props.description = value ?? null;
    }
    get is_active(): boolean {
        return this.props.is_active
    }
    private set is_active(value: boolean) {
        this.props.is_active = value ?? true;
    }
    get created_at(): Date {
        return this.props.created_at
    }
}
